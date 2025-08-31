import { ErrorBoundary } from 'react-error-boundary'
import { BookAddFormAction } from './book-add-form-action'
import { Button } from '@components/ui/button'
import { FormLayout, FormLayoutField } from '@components/form/form-layout'
import { Input } from '@components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { FormAlert } from '@components/form/form-alert'
import { Label } from '@components/ui/label'

export function BookAddForm() {
  return (
    <ErrorBoundary FallbackComponent={FormAlert}>
      <BookAddFormAction>
        {({ pending }) => (
          <FormLayout>
            <FormLayout.Title>새 도서 추가</FormLayout.Title>

            <FormLayout.FieldGroup>
              <FormLayoutField>
                <FormLayoutField.Label>
                  <Label htmlFor="title_ko">한국어</Label>
                </FormLayoutField.Label>
                <Input type="text" id="title_ko" name="title_ko" required />
              </FormLayoutField>
              <FormLayoutField>
                <FormLayoutField.Label>
                  <Label htmlFor="title_ja">일본어</Label>
                </FormLayoutField.Label>
                <Input type="text" id="title_ja" name="title_ja" required />
              </FormLayoutField>
              <FormLayoutField>
                <FormLayoutField.Label>상태</FormLayoutField.Label>
                <Select name="status" required defaultValue="release">
                  <SelectTrigger>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="release">출간</SelectItem>
                      <SelectItem value="draft">초안</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormLayoutField>
              <FormLayoutField>
                <FormLayoutField.Label>
                  <Label htmlFor="link">링크</Label>
                </FormLayoutField.Label>
                <Input
                  type="url"
                  id="link"
                  name="link"
                  defaultValue="https://google.com"
                />
              </FormLayoutField>
              <FormLayoutField>
                <FormLayoutField.Label>
                  <Label htmlFor="cover">표지 이미지</Label>
                </FormLayoutField.Label>
                <Input type="file" id="cover" name="cover" accept="image/*" />
              </FormLayoutField>
            </FormLayout.FieldGroup>

            <FormLayout.Footer>
              <Button type="submit" disabled={pending} className="flex-1">
                도서 추가
              </Button>
            </FormLayout.Footer>
          </FormLayout>
        )}
      </BookAddFormAction>
    </ErrorBoundary>
  )
}
