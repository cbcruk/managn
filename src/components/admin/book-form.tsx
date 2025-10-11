import { FormLayout, FormLayoutField } from '@/components/form/form-layout'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { Book } from '@/lib/db/schema'
import { BookFormAuthors } from './book-form-authors'
import { BookFormSubmit } from './book-form-submit'
import { BookFormCover } from './book-form-cover'

type BookAddFormProps = {
  data: {
    book?: Book
  }
}

export function BookForm({ data }: BookAddFormProps) {
  const book = data.book

  return (
    <FormLayout>
      <FormLayout.FieldGroup>
        <FormLayoutField>
          <FormLayoutField.Label>
            <Label htmlFor="cover">표지 이미지</Label>
          </FormLayoutField.Label>
          <BookFormCover />
        </FormLayoutField>
        <FormLayoutField>
          <FormLayoutField.Label>
            <Label htmlFor="title_ko">한국어</Label>
          </FormLayoutField.Label>
          <Input
            type="text"
            id="title_ko"
            name="title_ko"
            defaultValue={book?.title_ko}
            required
          />
        </FormLayoutField>
        <FormLayoutField>
          <FormLayoutField.Label>
            <Label htmlFor="title_ja">일본어</Label>
          </FormLayoutField.Label>
          <Input
            type="text"
            id="title_ja"
            name="title_ja"
            defaultValue={book?.title_ja}
            required
          />
        </FormLayoutField>
        <FormLayoutField>
          <FormLayoutField.Label>
            <Label htmlFor="authors">작가</Label>
          </FormLayoutField.Label>
          <BookFormAuthors id={book?.id} />
        </FormLayoutField>
        <FormLayoutField>
          <FormLayoutField.Label>상태</FormLayoutField.Label>
          <Select
            name="status"
            required
            defaultValue={book?.status ?? 'release'}
          >
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
            defaultValue={book?.link ?? ''}
          />
        </FormLayoutField>
      </FormLayout.FieldGroup>
      <FormLayout.Footer>
        <BookFormSubmit />
      </FormLayout.Footer>
    </FormLayout>
  )
}
