import { useTab } from './BookForm.hooks'
import { match } from 'ts-pattern'

export function BookForm() {
  const { name, setName } = useTab()

  return match(name)
    .with('book', () => (
      <form
        onSubmit={async (e) => {
          e.preventDefault()

          try {
            const form = e.target as HTMLFormElement
            const formData = new FormData(form)
            const response = await fetch('/api/books', {
              method: 'POST',
              body: formData,
            })
            const _data = await response.json()

            form.reset()
          } catch (error) {
            alert(JSON.stringify(error))
          }
        }}
        className="text-sm"
      >
        <div className="flex flex-col gap-4 text-neutral-100">
          <div className="flex gap-4">
            <label className="flex gap-2">
              <input
                type="radio"
                name="status"
                value="release"
                defaultChecked
              />
              노출
            </label>
            <label className="flex gap-2">
              <input type="radio" name="status" value="draft" />
              미노출
            </label>
          </div>

          <label className="flex flex-col gap-1">
            한국어
            <input
              type="text"
              id="email"
              name="title_ko"
              required
              className="p-1 rounded-md text-stone-800"
            />
          </label>

          <label className="flex flex-col gap-1">
            일본어
            <input
              type="text"
              id="email"
              name="title_ja"
              required
              className="p-1 rounded-md text-stone-800"
            />
          </label>

          <label className="flex flex-col gap-1">
            링크
            <input
              type="text"
              name="link"
              className="p-1 rounded-md text-stone-800"
            />
          </label>
        </div>
        <div className="flex justify-end mt-4">
          <button type="submit" className="bg-red-200 rounded-lg p-1 text-xs">
            추가
          </button>
        </div>
      </form>
    ))
    .with('author', () => null)
    .otherwise(() => null)
}
