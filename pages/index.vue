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
            <p class="text-md text-[#a1a1aa] mt-2">Playing as: {{ playerName }}</p>
          </div>

          <!-- User Score Card -->
          <div class="mt-8">
            <div class="flex items-center justify-between p-4 rounded-lg bg-[#27272a] border border-[#3f3f46] hover:border-[#22c55e] transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-8 h-8 flex items-center justify-center rounded-full bg-[#18181b] border border-[#3f3f46]">
                  <span class="text-[#71717a] font-medium">#{{ leaderboard.length + 1 }}</span>
                </div>
                <span class="text-[#e4e4e7] font-medium">{{ playerName }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[#22c55e] font-bold">{{ finalScore.correct }}</span>
                <span class="text-[#71717a]">correct</span>
              </div>
            </div>
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
    
    <!-- Leaderboard Button -->
    <button
      @click="showLeaderboard = true"
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-[#18181b] text-[#e4e4e7] rounded-full border border-[#27272a] shadow-lg hover:bg-[#27272a] transition-all z-40 flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>
      Leaderboard
    </button>

    <!-- Standalone Leaderboard Modal -->
    <div v-if="showLeaderboard && !showGameOver" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-[#18181b] rounded-lg p-8 max-w-md w-full mx-4 border border-[#27272a]">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold text-[#f4f4f5] flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#22c55e]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            Leaderboard
          </h2>
          <button 
            @click="showLeaderboard = false"
            class="text-[#71717a] hover:text-[#e4e4e7] p-2 rounded-full hover:bg-[#27272a] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div class="space-y-2 mb-6 h-[400px] overflow-y-auto pr-2 scrollbar-thin">
          <div v-for="(entry, index) in leaderboard" :key="index" 
            class="flex items-center justify-between p-4 rounded-lg bg-[#27272a] border border-[#3f3f46] hover:border-[#22c55e] transition-colors"
          >
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 flex items-center justify-center rounded-full bg-[#18181b] border border-[#3f3f46]">
                <span class="text-[#71717a] font-medium">{{ index + 1 }}</span>
              </div>
              <span class="text-[#e4e4e7] font-medium">{{ entry.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[#22c55e] font-bold">{{ entry.score }}</span>
              <span class="text-[#71717a]">correct</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuiz } from '~/composables/useQuiz'
import { useLeaderboard } from '~/composables/useLeaderboard'
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
  playerName, showLeaderboard, leaderboard, 
  generateNewPlayerName, addScore 
} = useLeaderboard()

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
  generateNewPlayerName()
  await addScore(finalScore.value.correct, finalScore.value.total)
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