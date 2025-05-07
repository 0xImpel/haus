"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { getFirestore, collection, addDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// Modal for selecting days
const DaysSelector = ({ selectedDays, onDayPress, onClose }) => {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      onDayPress(selectedDays.filter((d) => d !== day))
    } else {
      onDayPress([...selectedDays, day])
    }
  }

  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select days</Text>
      <View style={styles.daysGrid}>
        {weekdays.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, selectedDays.includes(day) && styles.selectedDayButton]}
            onPress={() => toggleDay(day)}
          >
            <Text style={[styles.dayButtonText, selectedDays.includes(day) && styles.selectedDayText]}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.doneButton} onPress={onClose}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  )
}

// Modal for selecting duration
const DurationSelector = ({ selectedDuration, onDurationSelected, onClose }) => {
  const durations = ["21 days", "90 days", "180 days", "270 days"]

  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Set duration</Text>
      <View style={styles.durationGrid}>
        {durations.map((duration) => (
          <TouchableOpacity
            key={duration}
            style={[styles.durationButton, selectedDuration === duration && styles.selectedDurationButton]}
            onPress={() => onDurationSelected(duration)}
          >
            <Text style={[styles.durationButtonText, selectedDuration === duration && styles.selectedDurationText]}>
              {duration}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.doneButton} onPress={onClose}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  )
}

// Set Timer component
const TimerPicker = ({ selectedHours, selectedMinutes, onTimeSelected, onClose }) => {
  const [hours, setHours] = useState(selectedHours || "00")
  const [minutes, setMinutes] = useState(selectedMinutes || "45")

  // Generate arrays for hour and minute options
  const hoursArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minutesArray = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  const handleDone = () => {
    onTimeSelected(hours, minutes)
    onClose()
  }

  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>set timer</Text>

      <View style={styles.timePickerContainer}>
        {/* Hours and Minutes columns with separator */}
        <View style={styles.timePickerColumnsContainer}>
          {/* Hours column */}
          <View style={styles.timePickerColumn}>
            <ScrollView
              style={styles.timePickerScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.timePickerScrollContent}
              scrollEnabled={true}
            >
              {hoursArray.map((hour) => (
                <TouchableOpacity
                  key={`hour-${hour}`}
                  style={[styles.timeOption, hours === hour && styles.selectedTimeOption]}
                  onPress={() => setHours(hour)}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      hours === hour ? styles.selectedTimeText : styles.unselectedTimeText,
                    ]}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Separator */}
          <View style={styles.timeSeparator}>
            <Text style={styles.timeSeparatorText}>:</Text>
          </View>

          {/* Minutes column */}
          <View style={styles.timePickerColumn}>
            <ScrollView
              style={styles.timePickerScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.timePickerScrollContent}
              scrollEnabled={true}
            >
              {minutesArray.map((minute) => (
                <TouchableOpacity
                  key={`minute-${minute}`}
                  style={[styles.timeOption, minutes === minute && styles.selectedTimeOption]}
                  onPress={() => setMinutes(minute)}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      minutes === minute ? styles.selectedTimeText : styles.unselectedTimeText,
                    ]}
                  >
                    {minute}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  )
}

// Routine Planner component (from/to time selection)
const RoutinePlanner = ({ fromHours, fromMinutes, toHours, toMinutes, onTimeSelected, onClose, step = "from" }) => {
  const [tempFromHours, setTempFromHours] = useState(fromHours || "13")
  const [tempFromMinutes, setTempFromMinutes] = useState(fromMinutes || "45")
  const [tempToHours, setTempToHours] = useState(toHours || "15")
  const [tempToMinutes, setTempToMinutes] = useState(toMinutes || "45")
  const [currentStep, setCurrentStep] = useState(step)

  const hoursArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minutesArray = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  const handleNext = () => {
    if (currentStep === "from") {
      setCurrentStep("to")
    } else {
      onTimeSelected(tempFromHours, tempFromMinutes, tempToHours, tempToMinutes)
      onClose()
    }
  }

  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Plan routine</Text>

      {/* From Time - Always visible */}
      <View style={styles.timePickerContainer}>
        <Text style={styles.timeLabel}>from</Text>
        <View style={[styles.timePickerColumnsContainer, { opacity: currentStep === "from" ? 1 : 0.5 }]}>
          <View style={styles.timePickerColumn}>
            <ScrollView
              style={styles.timePickerScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.timePickerScrollContent}
              scrollEnabled={currentStep === "from"}
            >
              {hoursArray.map((hour) => (
                <TouchableOpacity
                  key={`from-hour-${hour}`}
                  style={[styles.timeOption, tempFromHours === hour && styles.selectedTimeOption]}
                  onPress={() => currentStep === "from" && setTempFromHours(hour)}
                  disabled={currentStep !== "from"}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      tempFromHours === hour ? styles.selectedTimeText : styles.unselectedTimeText,
                    ]}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.timeSeparator}>
            <Text style={styles.timeSeparatorText}>:</Text>
          </View>
          <View style={styles.timePickerColumn}>
            <ScrollView
              style={styles.timePickerScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.timePickerScrollContent}
              scrollEnabled={currentStep === "from"}
            >
              {minutesArray.map((minute) => (
                <TouchableOpacity
                  key={`from-minute-${minute}`}
                  style={[styles.timeOption, tempFromMinutes === minute && styles.selectedTimeOption]}
                  onPress={() => currentStep === "from" && setTempFromMinutes(minute)}
                  disabled={currentStep !== "from"}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      tempFromMinutes === minute ? styles.selectedTimeText : styles.unselectedTimeText,
                    ]}
                  >
                    {minute}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      {/* To Time */}
      <View style={styles.timePickerContainer}>
        <Text style={styles.timeLabel}>to</Text>
        <View style={[styles.timePickerColumnsContainer, { opacity: currentStep === "to" ? 1 : 0.5 }]}>
          <View style={styles.timePickerColumn}>
            <ScrollView
              style={styles.timePickerScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.timePickerScrollContent}
              scrollEnabled={currentStep === "to"}
            >
              {hoursArray.map((hour) => (
                <TouchableOpacity
                  key={`to-hour-${hour}`}
                  style={[styles.timeOption, tempToHours === hour && styles.selectedTimeOption]}
                  onPress={() => currentStep === "to" && setTempToHours(hour)}
                  disabled={currentStep !== "to"}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      tempToHours === hour ? styles.selectedTimeText : styles.unselectedTimeText,
                    ]}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.timeSeparator}>
            <Text style={styles.timeSeparatorText}>:</Text>
          </View>
          <View style={styles.timePickerColumn}>
            <ScrollView
              style={styles.timePickerScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.timePickerScrollContent}
              scrollEnabled={currentStep === "to"}
            >
              {minutesArray.map((minute) => (
                <TouchableOpacity
                  key={`to-minute-${minute}`}
                  style={[styles.timeOption, tempToMinutes === minute && styles.selectedTimeOption]}
                  onPress={() => currentStep === "to" && setTempToMinutes(minute)}
                  disabled={currentStep !== "to"}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      tempToMinutes === minute ? styles.selectedTimeText : styles.unselectedTimeText,
                    ]}
                  >
                    {minute}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleNext}>
        <Text style={styles.saveButtonText}>{currentStep === "from" ? "Next" : "Save"}</Text>
      </TouchableOpacity>
    </View>
  )
}

export function CreateHabitScreen() {
  const navigation = useNavigation()
  const [habit, setHabit] = useState("")
  const [timeOption, setTimeOption] = useState("")
  const [frequencyOption, setFrequencyOption] = useState("")
  const [durationOption, setDurationOption] = useState("")
  const [selectedDays, setSelectedDays] = useState([])
  const [showDaysModal, setShowDaysModal] = useState(false)
  const [showDurationModal, setShowDurationModal] = useState(false)
  const [habitCreated, setHabitCreated] = useState(false)
  const [habits, setHabits] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // State for both time options
  // "Set Timer" states
  const [showTimerModal, setShowTimerModal] = useState(false)
  const [selectedHours, setSelectedHours] = useState("00")
  const [selectedMinutes, setSelectedMinutes] = useState("45")

  // "Plan Routine" states
  const [showRoutineModal, setShowRoutineModal] = useState(false)
  const [fromHours, setFromHours] = useState("13")
  const [fromMinutes, setFromMinutes] = useState("45")
  const [toHours, setToHours] = useState("15")
  const [toMinutes, setToMinutes] = useState("45")
  const [routineStep, setRoutineStep] = useState("from")
  const [selectingFrom, setSelectingFrom] = useState(true); // NEW FLAG


  const handleSelectDays = (days) => {
    setSelectedDays(days)
    if (days.length > 0) {
      setFrequencyOption("select days")
    }
  }

  const handleSelectDuration = (duration) => {
    setDurationOption(duration)
    setShowDurationModal(false)
  }

  // Handler for timer selection
  const handleSelectTimer = (hours, minutes) => {
    setSelectedHours(hours)
    setSelectedMinutes(minutes)
    setTimeOption("set timer")
    setShowTimerModal(false)
  }

  // Handler for routine selection
  const handleSelectRoutine = (fHours, fMinutes, tHours, tMinutes) => {
    setFromHours(fHours)
    setFromMinutes(fMinutes)
    setToHours(tHours)
    setToMinutes(tMinutes)
    setTimeOption("plan routine")
    setShowRoutineModal(false)
    setRoutineStep("from")
  }

  // Function to save habit to Firebase
  const saveHabitToFirestore = async (habitData) => {
    try {
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        console.log("No user is signed in")
        return { success: false, error: "User not authenticated" }
      }

      const db = getFirestore()

      // Add user ID to the habit data
      const habitWithUser = {
        ...habitData,
        userId: user.uid,
        createdAt: new Date(),
        completedDays: [],
        streak: 0,
        active: true,
      }

      // Add to Firestore
      const docRef = await addDoc(collection(db, "habits"), habitWithUser)
      console.log("Habit saved with ID:", docRef.id)

      return {
        success: true,
        habitId: docRef.id,
      }
    } catch (error) {
      console.error("Error saving habit:", error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Modified addHabit function to save to Firebase
  const addHabit = async () => {
    if (habit) {
      setIsLoading(true)

      try {
        let timeDisplay = "(time)"

        // Format time based on selection
        if (timeOption === "set timer") {
          const hoursVal = Number.parseInt(selectedHours)
          const minutesVal = Number.parseInt(selectedMinutes)

          if (hoursVal > 0 && minutesVal > 0) {
            timeDisplay = `${hoursVal}h ${minutesVal}m`
          } else if (hoursVal > 0) {
            timeDisplay = `${hoursVal}h`
          } else if (minutesVal > 0) {
            timeDisplay = `${minutesVal}m`
          } else {
            timeDisplay = "0m"
          }
        } else if (timeOption === "plan routine") {
          timeDisplay = `from ${fromHours}:${fromMinutes} to ${toHours}:${toMinutes}`
        }

        const newHabit = {
          name: habit,
          time: timeDisplay,
          frequency:
            frequencyOption === "everyday"
              ? "everyday"
              : frequencyOption === "select days" && selectedDays.length > 0
                ? selectedDays.join(", ")
                : "(days)",
          duration: durationOption || "(duration)",
        }

        // Save to Firebase
        const result = await saveHabitToFirestore(newHabit)

        if (result.success) {
          // Add the Firebase ID to the habit object
          newHabit.id = result.habitId

          // Update local state
          setHabits([...habits, newHabit])
          setHabitCreated(true)

          // Reset form for next habit
          setHabit("")
          setTimeOption("")
          setFrequencyOption("")
          setDurationOption("")
          setSelectedDays([])
          setSelectedHours("00")
          setSelectedMinutes("45")
          setFromHours("13")
          setFromMinutes("45")
          setToHours("15")
          setToMinutes("45")

          Alert.alert("Success", "Habit saved to database!")
        } else {
          Alert.alert("Error", "Failed to save habit: " + (result.error || "Unknown error"))
        }
      } catch (error) {
        console.error("Error in addHabit:", error)
        Alert.alert("Error", "An unexpected error occurred.")
      } finally {
        setIsLoading(false)
      }
    } else {
      Alert.alert("Error", "Please enter a habit name.")
    }
  }

  // Generate summary text based on selected options
  const getSummaryText = () => {
    const habitText = habit || "(habit)"
    let timeText = "(time)"

    // Format time text based on selection
    if (timeOption === "set timer") {
      const hoursVal = Number.parseInt(selectedHours)
      const minutesVal = Number.parseInt(selectedMinutes)

      const hoursText = hoursVal > 0 ? (hoursVal === 1 ? "1 hour" : `${hoursVal} hours`) : ""

      const minutesText = minutesVal > 0 ? (minutesVal === 1 ? "1 minute" : `${minutesVal} minutes`) : ""

      if (hoursVal > 0 && minutesVal > 0) {
        timeText = `for ${hoursText} ${minutesText}`
      } else if (hoursVal > 0) {
        timeText = `for ${hoursText}`
      } else if (minutesVal > 0) {
        timeText = `for ${minutesText}`
      } else {
        timeText = "for 0 minutes"
      }
    } else if (timeOption === "plan routine") {
      timeText = `from ${fromHours}:${fromMinutes} to ${toHours}:${toMinutes}`
    }

    const daysText =
      frequencyOption === "everyday"
        ? "everyday"
        : frequencyOption === "select days" && selectedDays.length > 0
          ? selectedDays.join(", ")
          : "(days)"
    const durationText = durationOption || "(duration)"

    return `I will ${habitText} ${timeText}, on ${daysText} for ${durationText}`
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create habit</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.inputPrefix}>I will </Text>
            <TextInput
              style={styles.input}
              placeholder='"train BJJ"'
              value={habit}
              onChangeText={setHabit}
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Time</Text>

        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[styles.optionButton, timeOption === "set timer" && styles.activeOptionButton]}
            onPress={() => {
              setTimeOption("set timer")
              setShowTimerModal(true)
            }}
          >
            <Text style={[styles.optionText, timeOption === "set timer" && styles.activeOptionText]}>set timer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, timeOption === "plan routine" && styles.activeOptionButton]}
            onPress={() => {
              setTimeOption("plan routine")
              setRoutineStep("from")
              setShowRoutineModal(true)
            }}
          >
            <Text style={[styles.optionText, timeOption === "plan routine" && styles.activeOptionText]}>
              plan routine
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Frequency</Text>

        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[styles.optionButton, frequencyOption === "everyday" && styles.activeOptionButton]}
            onPress={() => setFrequencyOption("everyday")}
          >
            <Text style={[styles.optionText, frequencyOption === "everyday" && styles.activeOptionText]}>everyday</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, frequencyOption === "select days" && styles.activeOptionButton]}
            onPress={() => {
              setFrequencyOption("select days")
              setShowDaysModal(true)
            }}
          >
            <Text style={[styles.optionText, frequencyOption === "select days" && styles.activeOptionText]}>
              select days
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Duration</Text>

        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[styles.optionButton, durationOption === "365 days" && styles.activeOptionButton]}
            onPress={() => setDurationOption("365 days")}
          >
            <Text style={[styles.optionText, durationOption === "365 days" && styles.activeOptionText]}>365 days</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              durationOption !== "" && durationOption !== "365 days" && styles.activeOptionButton,
            ]}
            onPress={() => setShowDurationModal(true)}
          >
            <Text
              style={[
                styles.optionText,
                durationOption !== "" && durationOption !== "365 days" && styles.activeOptionText,
              ]}
            >
              set duration
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={[styles.summaryText, habitCreated && styles.habitCreatedText]}>• {getSummaryText()}</Text>

          <TouchableOpacity
            style={[styles.addHabitButton, isLoading && styles.disabledButton]}
            onPress={addHabit}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="rgba(0, 0, 0, 0.6)" />
                <Text style={styles.addHabitText}>Saving...</Text>
              </View>
            ) : (
              <Text style={styles.addHabitText}>add habit +</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.finishButtonContainer}>
          <TouchableOpacity
            style={[styles.finishButton, habits.length === 0 && styles.disabledButton]}
            onPress={() => habits.length > 0 && navigation.navigate("HabitList", { habits })}
            disabled={habits.length === 0}
          >
            <Text style={[styles.finishButtonText, habits.length === 0 && styles.disabledButtonText]}>
              Finish setup
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Days Selection Modal */}
      <Modal visible={showDaysModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <DaysSelector
            selectedDays={selectedDays}
            onDayPress={handleSelectDays}
            onClose={() => setShowDaysModal(false)}
          />
        </View>
      </Modal>

      {/* Duration Selection Modal */}
      <Modal visible={showDurationModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <DurationSelector
            selectedDuration={durationOption}
            onDurationSelected={handleSelectDuration}
            onClose={() => setShowDurationModal(false)}
          />
        </View>
      </Modal>

      {/* Timer Selection Modal */}
      <Modal visible={showTimerModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <TimerPicker
            selectedHours={selectedHours}
            selectedMinutes={selectedMinutes}
            onTimeSelected={handleSelectTimer}
            onClose={() => setShowTimerModal(false)}
          />
        </View>
      </Modal>

      {/* Routine Selection Modal */}
      <Modal visible={showRoutineModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <RoutinePlanner
            fromHours={fromHours}
            fromMinutes={fromMinutes}
            toHours={toHours}
            toMinutes={toMinutes}
            onTimeSelected={handleSelectRoutine}
            onClose={() => setShowRoutineModal(false)}
            step={routineStep}
          />
        </View>
      </Modal>
    </SafeAreaView>
  )
}

// Updated styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Medium",
    fontWeight: "500",
    color: "#000",
    marginTop: 40,
    marginBottom: 40,
    lineHeight: 38.4,
  },
  inputContainer: {
    marginBottom: 40,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputPrefix: {
    fontSize: 16,
    fontFamily: "Inter-Light",
    fontWeight: "300",
    color: "rgba(0, 0, 0, 0.6)",
  },
  input: {
    fontSize: 16,
    fontFamily: "Inter-Light",
    fontWeight: "300",
    color: "rgba(0, 0, 0, 0.6)",
    padding: 0,
  },
  sectionLabel: {
    fontSize: 12, // Smaller font size as requested
    fontFamily: "Inter-Light",
    fontWeight: "300",
    color: "rgba(0, 0, 0, 0.6)",
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    backgroundColor: "#FCFCFC",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
    marginRight: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  activeOptionButton: {
    backgroundColor: "#000",
    borderColor: "#000",
    shadowOpacity: 0,
    elevation: 0,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.6)",
    textAlign: "center",
  },
  activeOptionText: {
    color: "#fff",
  },
  summaryContainer: {
    marginTop: 40,
  },
  summaryText: {
    fontSize: 12, // Smaller font size as requested
    fontFamily: "Inter-Light",
    fontWeight: "300",
    color: "rgba(0, 0, 0, 0.3)",
    lineHeight: 20,
    marginBottom: 24,
  },
  habitCreatedText: {
    color: "rgba(0, 0, 0, 0.6)",
  },
  addHabitButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    backgroundColor: "#FCFCFC",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addHabitText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.6)",
  },
  finishButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom: 20,
  },
  finishButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    backgroundColor: "#FCFCFC",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  finishButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.6)",
  },
  disabledButtonText: {
    color: "rgba(0, 0, 0, 0.4)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FCFCFC",
    borderRadius: 8,
    padding: 24,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "#000",
    marginBottom: 24,
    textAlign: "left",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 24,
  },
  dayButton: {
    margin: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    backgroundColor: "#FCFCFC",
    minWidth: 70,
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.15)", // Consistent shadow
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  selectedDayButton: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  dayButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.15)", // Text color at 15% opacity as requested
  },
  selectedDayText: {
    color: "#fff",
  },
  durationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // Changed to align with left edge
    marginBottom: 24,
  },
  durationButton: {
    margin: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    backgroundColor: "#FCFCFC",
    width: "40%", // Smaller width as requested
    alignItems: "center",
    marginBottom: 8, // Reduced margin as requested
    marginRight: 8, // Added to maintain spacing
    shadowColor: "rgba(0, 0, 0, 0.15)", // Consistent shadow
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  selectedDurationButton: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  durationButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.15)", // Text color at 15% opacity as requested
  },
  selectedDurationText: {
    color: "#fff",
  },
  doneButton: {
    alignSelf: "flex-end",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    backgroundColor: "#FCFCFC",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  saveButton: {
    alignSelf: "flex-end",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    backgroundColor: "#FCFCFC",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.6)",
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.6)",
  },
  timePickerContainer: {
    marginVertical: 10,
    height: 150,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  timePickerColumnsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
  },
  timePickerColumn: {
    width: 60,
    height: 150,
    overflow: "hidden",
  },
  timePickerScrollView: {
    height: 150,
  },
  timePickerScrollContent: {
    paddingVertical: 55,
  },
  timeOption: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTimeOption: {
    backgroundColor: "rgba(0, 0, 0, 0.05)", // Added visible selected time bar
    borderRadius: 4,
  },
  timeOptionText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
  },
  selectedTimeText: {
    color: "rgba(0, 0, 0, 0.6)",
  },
  unselectedTimeText: {
    color: "rgba(0, 0, 0, 0.2)",
  },
  timeSeparator: {
    paddingHorizontal: 12, // Added 12px margin as requested
  },
  timeSeparatorText: {
    fontSize: 20,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.6)",
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: "Inter-Light",
    fontWeight: "300",
    color: "rgba(0, 0, 0, 0.6)",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
})
