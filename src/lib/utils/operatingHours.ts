interface DayHours {
  day: string
  hours: string
}

export const formatOperatingHours = (hours: Record<string, string>): DayHours[] => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  return days.map((day, index) => ({
    day: dayNames[index],
    hours: hours[day] || hours[day.toLowerCase()] || 'Closed'
  }))
}
