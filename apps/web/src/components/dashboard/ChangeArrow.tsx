interface ChangeArrowProps {
  change: number
  intendedDirection: number
}

const ChangeArrow = ({ change, intendedDirection }: ChangeArrowProps) => {
  const isGood = intendedDirection < 0 ? change < 0 : change > 0
  const color = isGood ? "text-green-600" : "text-red-600"
  
  if (Math.abs(change) < 0.01) {
    return null
  }
  
  return (
    <span className={color} aria-label={isGood ? "Positive change" : "Negative change"}>
      {change > 0 ? "↑" : "↓"}
    </span>
  )
}

export default ChangeArrow