import { ref } from 'vue'

export const useLeaderboard = () => {
  const playerName = ref('')
  const isSubmitting = ref(false)
  const showLeaderboard = ref(false)
  const leaderboard = ref([])

  const generateUsername = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `Player#${randomNum}`
  }

  const generateNewPlayerName = () => {
    playerName.value = generateUsername()
  }

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(10)

      if (error) throw error
      leaderboard.value = data
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  const addScore = async (score, total) => {
    try {
      isSubmitting.value = true
      const { error } = await supabase
        .from('leaderboard')
        .insert([
          {
            name: playerName.value,
            score: score,
            total: total,
            created_at: new Date()
          }
        ])

      if (error) throw error
      await fetchLeaderboard()
    } catch (error) {
      console.error('Error adding score:', error)
    } finally {
      isSubmitting.value = false
    }
  }

  // Initial fetch
  fetchLeaderboard()

  return {
    playerName,
    isSubmitting,
    showLeaderboard,
    leaderboard,
    generateNewPlayerName,
    addScore,
    fetchLeaderboard
  }
}