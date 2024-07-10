
export default function LevelCircle({ level }: number) {
  const maxLevel = 30

  // Calculate the percentage of the border to be shown
  const percentage = (level / maxLevel) * 100

  // Total length of the circle's circumference
  const circumference = 2 * Math.PI * 15 // Radius is 15

  // Length of the border to be shown
  const dashArray = (percentage / 100) * circumference

  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg className="absolute inset-0" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="15"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="20"
          cy="20"
          r="15"
          stroke="#4f46e5" // Border color (accent)
          strokeWidth="4"
          fill="none"
          strokeDasharray={`${dashArray} ${circumference - dashArray}`}
          strokeDashoffset="0"
          transform="rotate(-90 20 20)" // Start the stroke from the top
        />
      </svg>
      <div className="absolute text-sm font-bold">{level}</div>
    </div>
  )
}
