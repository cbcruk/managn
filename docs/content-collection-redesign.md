# 콘텐츠 컬렉션 재설계 작업 노트

> **상태**: ✅ **해결 완료** (2025-09-03)  
> **최종 결정**: Content Collections 제거 → Pure Database Architecture 채택  
> **결과**: 모든 validation 이슈 해결, 263개 author 페이지 + 19개 book 페이지 정상 빌드

## 현재 문제점

### 오류 상황
```
[InvalidContentEntryDataError] authors → 293 data does not match collection schema.
books.1: Reference to books invalid. Entry 374 does not exist.
```

### 근본 원인
- Astro 콘텐츠 컬렉션은 정적 데이터 검증 위주로 설계됨
- 동적 DB 데이터와 reference() 검증 간 충돌
- 사용자가 책→저자→관계 순서로 데이터 입력 시 중간 단계에서 검증 실패

## 현재 구조 (src/content/config.ts)

### Books Collection
```typescript
// DB 쿼리: books + book_authors + authors JOIN
// 문제: authors 필수 참조로 인한 검증 실패
authors: z.array(reference('authors')) // 현재
authors: z.array(reference('authors')).optional().default([]) // 임시 수정
```

### Authors Collection  
```typescript
// DB 쿼리: authors + book_authors + books JOIN
// 문제: 존재하지 않는 book 참조 시 실패
books: z.array(reference('books')) // 현재
books: z.array(reference('books')).optional().default([]) // 임시 수정
```

## 재설계 옵션

### 1. 콘텐츠 컬렉션 완전 제거
```typescript
// 장점: 검증 복잡성 제거, 유연한 데이터 입력
// 단점: Astro 생태계 이점 상실, 타입 안전성 감소
// 구현: pages에서 직접 DB 쿼리 사용
```

### 2. 관계 단순화  
```typescript
// books 테이블에 authors를 JSON/CSV로 비정규화
authors: z.array(z.string()) // author names instead of references
```

### 3. 검증 완화
```typescript
// 현재 시도한 방법
authors: z.array(reference('authors')).optional().default([])
// + 로더에서 INNER JOIN으로 유효한 관계만
```

### 4. 단계별 검증
```typescript
// draft 상태에서는 관계 검증 skip
authors: z.array(reference('authors')).refine(data => 
  status === 'draft' || data.length > 0
)
```

## 구현 상태

### 완성된 기능
- `/books/add` - 도서 추가 UI (이미지 업로드 포함)
- `/authors/add` - 작가 추가 UI
- `/api/upload-cover` - 이미지 WebP 변환 API
- 헤더 네비게이션 (개발 환경만)

### 대기중인 이슈
- 콘텐츠 컬렉션 참조 검증 실패로 dev 서버 실행 불가
- authors → books 관계에서 Entry 374 참조 오류

## 데이터베이스 확인 결과
```sql
-- 참조 무결성은 정상
SELECT COUNT(*) FROM book_authors WHERE book_id NOT IN (SELECT id FROM books); -- 0
SELECT COUNT(*) FROM book_authors WHERE author_id NOT IN (SELECT id FROM authors); -- 0

-- 문제 데이터 확인
SELECT id FROM authors WHERE id = 293; -- 존재함
SELECT book_id FROM book_authors WHERE author_id = 293; -- 344, 374
SELECT id, status FROM books WHERE id IN (344, 374); -- 둘 다 release 상태
```

## 추천 방향성
1. **단기**: 검증 완화로 우선 실행 가능하게 만들기
2. **중기**: 데이터 입력 워크플로우 개선 (UI 완성도 높이기)
3. **장기**: 콘텐츠 컬렉션 vs 순수 DB 아키텍처 재검토

## ✅ 해결 과정 및 결과 (2025-09-03)

### 최종 선택: Pure Database Architecture
**결정 사유**:
- Content Collections의 reference validation이 동적 DB 데이터와 근본적으로 맞지 않음
- 정적 사이트 생성에는 빌드 타임에 모든 관계가 확정되어야 하는데, DB는 런타임 특성
- 복잡한 workaround보다는 명확한 아키텍처가 유지보수에 유리

### 구현된 변경사항
1. **Content Collections 완전 제거**
   - `src/content/config.ts`를 빈 객체로 변경
   - 모든 `getCollection()` 호출 제거

2. **새로운 데이터 레이어 구축** (`src/lib/data.ts`)
   - `getReleasedBooks()` - 모든 출간 도서 조회
   - `getReleasedBooksByAuthor(authorId)` - 특정 작가의 도서 조회
   - `getAuthorsWithBooks()` - 도서가 있는 작가 조회  
   - `getAuthorById()`, `getRandomBooks()` 등
   - 헬퍼 함수: `createCoverUrl()`, `parseAuthorData()`, `parseBookData()`

3. **이미지 경로 최적화**
   - `src/content/books/assets/` → `public/books/`로 이동 (`git mv` 사용)
   - 프로덕션 환경에서 이미지 접근 문제 해결
   - `createCoverUrl()` 함수로 일관된 경로 관리

4. **TypeScript 타입 안전성 강화**
   - Drizzle ORM의 `inArray()` 함수로 타입 안전한 쿼리
   - nullable 값 처리를 위한 type guard 적용
   - JSDoc으로 모든 함수 문서화

### 성능 및 결과
- ✅ **빌드 성공**: 263개 author 페이지 + 19개 book 페이지 정상 prerender
- ✅ **개발 서버 안정**: validation 에러 완전 해결
- ✅ **타입 안전성**: 모든 TypeScript 에러 해결
- ✅ **이미지 최적화**: 프로덕션 환경 호환성 확보

### 교훈
- **아키텍처 결정 시 도구의 설계 의도를 고려**해야 함
- Content Collections는 마크다운 기반 정적 콘텐츠에 최적화됨
- 동적 관계형 데이터에는 직접 DB 쿼리가 더 적합
- **단순하고 명확한 해결책**이 복잡한 workaround보다 낫다

---

## 원본 분석 (참고용)

### 작업 재개 시 체크사항 (완료됨)
- [x] dev 서버 정상 실행 확인
- [x] `/books/add`, `/authors/add` 페이지 테스트  
- [x] 이미지 업로드 기능 검증
- [x] 데이터 일관성 확인