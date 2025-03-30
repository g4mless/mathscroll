export const useSupabase = () => {
  const nuxtApp = useNuxtApp()
  
  return {
    client: nuxtApp.$supabase
  }
}