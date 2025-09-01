import clsx from 'clsx'

export function NavigationItem({ label, isActive, children }) {
  return (
    <div className="flex flex-col justify-center items-center text-xs">
      <span
        className={clsx(
          'flex justify-center items-center w-[64px] h-[24px] rounded-full mb-[4px]',
          {
            'bg-neutral-700': isActive,
          }
        )}
      >
        {children}
      </span>
      <span
        className={clsx({
          'font-medium': isActive,
        })}
      >
        {label}
      </span>
    </div>
  )
}
