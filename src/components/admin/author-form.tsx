import { FormLayout, FormLayoutField } from '@/components/form/form-layout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Author } from '@/lib/db/schema'
import { AuthorFormSubmit } from './author-form-submit'

type AuthorFormProps = {
  data: {
    author?: Author
  }
}

export function AuthorForm({ data }: AuthorFormProps) {
  const author = data.author

  return (
    <FormLayout>
      <FormLayout.FieldGroup>
        <FormLayoutField>
          <FormLayoutField.Label>
            <Label htmlFor="name_ko">한국어</Label>
          </FormLayoutField.Label>
          <Input
            type="text"
            id="name_ko"
            name="name_ko"
            defaultValue={author?.name_ko}
            required
          />
        </FormLayoutField>
        <FormLayoutField>
          <FormLayoutField.Label>
            <Label htmlFor="name_ja">일본어</Label>
          </FormLayoutField.Label>
          <Input
            type="text"
            id="name_ja"
            name="name_ja"
            defaultValue={author?.name_ja}
            required
          />
        </FormLayoutField>
      </FormLayout.FieldGroup>
      <FormLayout.Footer>
        <AuthorFormSubmit />
      </FormLayout.Footer>
    </FormLayout>
  )
}
