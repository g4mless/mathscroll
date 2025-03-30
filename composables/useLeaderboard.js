import { ref } from 'vue'
import { useSupabase } from './useSupabase'

export const useLeaderboard = () => {
  const { client } = useSupabase()
  const playerName = ref('')
  const isSubmitting = ref(false)
  const showLeaderboard = ref(false)
  const leaderboard = ref([])

  const generateUsername = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9001)
    return `Player#${randomNum}`
  }

  const generateNewPlayerName = () => {
    playerName.value = generateUsername()
  }

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await client
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
      const { error } = await client
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
      
      const { data: rankData } = await client
        .from('leaderboard')
        .select('id')
        .gte('score', score)
        .order('score', { ascending: false })

      await fetchLeaderboard()
      return rankData ? rankData.length : 1
      
    } catch (error) {
      console.error('Error adding score:', error)
      return 1
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