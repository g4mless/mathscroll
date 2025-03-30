import { ref } from 'vue'
import { generateQuestions, generateRandomQuestion } from '~/utils/mathQuestions'

export const useQuiz = () => {
  const score = ref(0)
  const questions = ref([])
  const totalAnswered = ref(0)
  const currentIndex = ref(0)
  const showGameOver = ref(false)
  const finalScore = ref({
    correct: 0,
    total: 0,
    percentage: 0
  })

  const prepareQuestions = (questionList) => {
    return questionList.map(q => ({
      ...q,
      answered: false,
      selectedAnswer: null
    }))
  }

  const initQuiz = () => {
    questions.value = prepareQuestions(generateQuestions(1))
    score.value = 0
    totalAnswered.value = 0
    currentIndex.value = 0
  }

  const selectAnswer = async (selected, questionIndex) => {
    const question = questions.value[questionIndex]
    if (question.answered) return
    
    question.answered = true
    question.selectedAnswer = selected
    totalAnswered.value++
    
    if (selected === question.correct) {
      score.value++
    }
    
    if (questionIndex >= questions.value.length - 2) {
      const newQuestion = generateRandomQuestion()
      questions.value.push({
        ...newQuestion,
        answered: false,
        selectedAnswer: null
      })
    }
    
    currentIndex.value++
  }

  const endQuiz = () => {
    finalScore.value = {
      correct: score.value,
      total: totalAnswered.value,
      percentage: Math.round((score.value / totalAnswered.value) * 100)
    }
    showGameOver.value = true
  }

  const restartQuiz = (scrollContainer) => {
    initQuiz()
    showGameOver.value = false
    scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    score,
    questions,
    totalAnswered,
    currentIndex,
    showGameOver,
    finalScore,
    selectAnswer,
    endQuiz,
    restartQuiz,
    initQuiz
  }
}