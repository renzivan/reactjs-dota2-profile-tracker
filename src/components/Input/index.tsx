export default function Input({ handleChange }) {
  return (
    <input
      type="text"
      onChange={(evt) => handleChange(evt.target.value)}
    />
  )
}
