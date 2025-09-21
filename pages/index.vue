<template>
  <div class="h-screen flex flex-col bg-[#09090b] text-[#e4e4e7]">
    <!-- Start Screen -->
    <div v-if="!gameStarted" 
      @click="startGame"
      class="fixed inset-0 bg-[#09090b] flex items-center justify-center z-50 cursor-pointer"
    >
      <div class="text-center animate-pulse">
        <h1 class="text-4xl font-bold text-[#f4f4f5] mb-4">MathScroll</h1>
        <p class="text-[#a1a1aa]">Tap anywhere to start</p>
      </div>
    </div>

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
              <button
                v-if="totalAnswered >= 5"
                @click="handleEndQuiz"
                class="px-4 py-2 bg-[#15803d] text-white rounded-lg hover:bg-[#16a34a] transition-colors"
              >
                End Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Game Over Modal -->
    <div v-if="showGameOver" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-[#18181b] rounded-lg p-8 max-w-md w-full mx-4 border border-[#27272a]">
        <h2 class="text-3xl font-bold text-center mb-6 text-[#f4f4f5]">Quiz Ended</h2>
        
        <div class="space-y-4 mb-8">
          <div class="text-center">
            <p class="text-6xl font-bold text-[#22c55e] mb-2">{{ finalScore.percentage }}%</p>
            <p class="text-lg text-[#a1a1aa]">Correct Answers: {{ finalScore.correct }}/{{ finalScore.total }}</p>
          </div>
        </div>
        
        <button
          @click="handleRestartQuiz"
          class="w-full py-3 bg-[#15803d] text-white rounded-lg hover:bg-[#16a34a] transition-colors text-lg font-medium"
        >
          Play Again
        </button>
      </div>
    </div>
    

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuiz } from '~/composables/useQuiz'
import { useUIEffects } from '~/composables/useUIEffects'

const gameStarted = ref(false)

const startGame = () => {
  gameStarted.value = true
  initQuiz()
}

const { 
  score, questions, totalAnswered, showGameOver, 
  finalScore, selectAnswer, endQuiz, restartQuiz, initQuiz 
} = useQuiz()


const {
  currentQuestion, scrollContainer, getRandomGlowColor, handleScroll
} = useUIEffects()

onMounted(() => {
  initQuiz()
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
  }
})


const handleEndQuiz = async () => {
  endQuiz()
}

const handleRestartQuiz = () => {
  restartQuiz(scrollContainer.value)
}
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
    margin: 0.6rem;
  }
  
  .text-6xl {
    font-size: 2.5rem;
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
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  min-height: -webkit-fill-available;
}

.snap-start {
  scroll-snap-align: start;
  height: calc(var(--vh, 1vh) * 100);
  min-height: -webkit-fill-available;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fixed {
  animation: fadeIn 0.3s ease-in-out;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #27272a;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #52525b;
}
</style>