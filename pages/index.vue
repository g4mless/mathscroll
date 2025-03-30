<template>
  <div class="h-screen flex flex-col bg-[#09090b] text-[#e4e4e7]">
    <div class="flex-1 overflow-hidden">
      <div 
        class="h-full snap-y snap-mandatory overflow-y-auto smooth-scroll" 
        ref="scrollContainer"
      >
        <div 
          v-for="(question, index) in questions" 
          :key="index"
          class="h-full w-full flex items-center justify-center snap-start"
          :id="`question-${index}`"
        >
          <div 
            class="bg-[#18181b] rounded-lg shadow-lg p-6 max-w-md w-full border border-[#27272a] question-box"
            :class="{ 'glow-active': currentQuestion === index }"
            :style="{ '--glow-color': getRandomGlowColor(index) }"
          >
            <div class="mb-6">
              <h3 class="text-4xl mb-2 text-[#f4f4f5]">{{ question.question }}</h3>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="(option, optIndex) in question.options"
                :key="optIndex"
                @click="selectAnswer(option, index)"
                class="aspect-square flex items-center justify-center text-center p-4 rounded-lg text-6xl font-medium transition-all duration-200 border border-[#27272a] bg-[#1e1e21] text-[#e4e4e7]"
                :class="{
                  'hover:bg-[#27272a] hover:scale-[1.02] active:scale-95': !question.answered && currentQuestion === index,
                  'bg-[#166534] text-[#bbf7d0] border-[#166534] transform scale-100': question.answered && option === question.correct,
                  'bg-[#7f1d1d] text-[#fecaca] border-[#7f1d1d] transform scale-95': question.answered && option !== question.correct && question.selectedAnswer === option
                }"
                :disabled="question.answered"
              >
                {{ option }}
              </button>
            </div>
            
            <div class="mt-4 flex justify-between items-center">
              <p class="text-lg text-[#a1a1aa]">Score: {{ score }}/{{ totalAnswered }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { generateQuestions, generateRandomQuestion } from '~/utils/mathQuestions'

const score = ref(0)
const questions = ref([])
const scrollContainer = ref(null)
const totalAnswered = ref(0)
const currentIndex = ref(0)

// Prepare questions with additional properties
const prepareQuestions = (questionList) => {
  return questionList.map(q => ({
    ...q,
    answered: false,
    selectedAnswer: null
  }))
}

// Start quiz immediately when component is mounted
onMounted(() => {
  questions.value = prepareQuestions(generateQuestions(1))
  score.value = 0
  totalAnswered.value = 0
  currentIndex.value = 0
  
  // Add scroll event listener
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
  }
})

const selectAnswer = async (selected, questionIndex) => {
  const question = questions.value[questionIndex]
  
  // Skip if already answered
  if (question.answered) return
  
  // Mark as answered
  question.answered = true
  question.selectedAnswer = selected
  totalAnswered.value++
  
  // Update score if correct
  if (selected === question.correct) {
    score.value++
  }
  
  // Add a new question if we're near the end
  if (questionIndex >= questions.value.length - 2) {
    const newQuestion = generateRandomQuestion()
    questions.value.push({
      ...newQuestion,
      answered: false,
      selectedAnswer: null
    })
  }
  
  // Increment current index to show the next question
  currentIndex.value++
  
  // No auto-scrolling - let the user scroll manually when ready
}

// Update the colors to be more subtle and green-focused
const glowColors = [
  '#4ade8066',  // Mint green
  '#22c55e66',  // Medium green
  '#15803d66',  // Forest green
  '#16a34a66',  // Spring green
  '#86efac66',  // Light green
  '#4ade8066',  // Sage green
]

const getRandomGlowColor = (index) => {
  return glowColors[index % glowColors.length]
}

const currentQuestion = ref(0)

const handleScroll = () => {
  if (!scrollContainer.value) return
  const containerHeight = scrollContainer.value.clientHeight
  const scrollPosition = scrollContainer.value.scrollTop
  currentQuestion.value = Math.round(scrollPosition / containerHeight)
}

onMounted(() => {
  scrollContainer.value?.addEventListener('scroll', handleScroll)
})
</script>

<style>
html, body {
  margin: 0;
  height: 100%;
  overscroll-behavior-y: contain;
  background-color: #111827;
}

#__nuxt, #__layout {
  height: 100%;
}

.snap-y {
  scroll-snap-type: y mandatory;
}

.snap-start {
  scroll-snap-align: start;
}

/* Hide scrollbar but allow scrolling */
.overflow-y-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

.question-box {
  position: relative;
  box-shadow: 0 0 15px transparent;
  transition: box-shadow 0.3s ease;
  margin: 1rem;
}

.question-box.glow-active {
  box-shadow: 0 0 25px var(--glow-color);
  z-index: 1;
}

@media (max-width: 640px) {
  .question-box {
    margin: 1rem;
  }
  
  .text-6xl {
    font-size: 4rem;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .question-box {
    margin: 1rem;
  }
  
  .question-box.glow-active {
    box-shadow: 0 0 20px var(--glow-color);
  }
}

.h-screen {
  height: 100vh; /* Fallback */
  height: calc(var(--vh, 1vh) * 100);
  min-height: -webkit-fill-available; /* iOS Safari fix */
}

.snap-start {
  scroll-snap-align: start;
  height: calc(var(--vh, 1vh) * 100);
  min-height: -webkit-fill-available; /* iOS Safari fix */
}
</style>
