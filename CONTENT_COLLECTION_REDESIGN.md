# 콘텐츠 컬렉션 재설계 작업 노트

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

## 작업 재개 시 체크사항
- [ ] dev 서버 정상 실행 확인
- [ ] `/books/add`, `/authors/add` 페이지 테스트
- [ ] 이미지 업로드 기능 검증
- [ ] 데이터 일관성 확인