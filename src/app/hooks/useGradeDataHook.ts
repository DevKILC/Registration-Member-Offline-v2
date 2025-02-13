import { GradeQuery } from "../_backend/_utils/Interfaces"
import { useGradeDataStore } from "../hooks/useGradeDataStore"
import { gradeService } from "../services/gradeService"

export const useGradeDataHook = () => {
  
  const { setGrade } = useGradeDataStore()

  const getGradeData = async (filter: GradeQuery) => {
    
    await gradeService.getGrades(filter)
    .then((response) => {
      setGrade(response.data)
    })
    .catch((error) => {
      console.error("Error getting grade data:", error)
    })
  }

  return { 
    getGradeData
  }
}