export default function Button({ children, variant = 'primary', onClick, type = 'button', disabled = false, className }) {
  const cls = `btn btn-${variant}${className ? ' ' + className : ''}`
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>{children}</button>
  )
}
