import { ref } from 'vue'

export const useUIEffects = () => {
  const currentQuestion = ref(0)
  const scrollContainer = ref(null)

  const glowColors = [
    '#4ade8066',
    '#22c55e66',
    '#15803d66',
    '#16a34a66',
    '#86efac66',
    '#4ade8066',
  ]

  const getRandomGlowColor = (index) => {
    return glowColors[index % glowColors.length]
  }

  const handleScroll = () => {
    if (!scrollContainer.value) return
    const containerHeight = scrollContainer.value.clientHeight
    const scrollPosition = scrollContainer.value.scrollTop
    currentQuestion.value = Math.round(scrollPosition / containerHeight)
  }

  return {
    currentQuestion,
    scrollContainer,
    getRandomGlowColor,
    handleScroll
  }
}