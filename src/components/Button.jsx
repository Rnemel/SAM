export default function Button({ children, variant = 'primary', onClick, type = 'button' }) {
  const cls = `btn btn-${variant}`
  return (
    <button type={type} className={cls} onClick={onClick}>{children}</button>
  )
}
