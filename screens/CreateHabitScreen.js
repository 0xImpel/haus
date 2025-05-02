import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Mock calendar component - you would replace this with a real calendar library
const CalendarPicker = ({ onDayPress, selectedDays, onClose, title }) => {
  // This is a simplified mock - you would use a real calendar component
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      onDayPress(selectedDays.filter(d => d !== day));
    } else {
      onDayPress([...selectedDays, day]);
    }
  };
  
  return (
    <View style={styles.calendarContainer}>
      <Text style={styles.calendarTitle}>{title}</Text>
      <View style={styles.weekdaysContainer}>
        {weekdays.map(day => (
          <TouchableOpacity 
            key={day}
            style={[
              styles.dayButton,
              selectedDays.includes(day) && styles.selectedDayButton
            ]}
            onPress={() => toggleDay(day)}
          >
            <Text style={[
              styles.dayButtonText,
              selectedDays.includes(day) && styles.selectedDayText
            ]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.doneButton} onPress={onClose}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

// Duration picker component
const DurationPicker = ({ onDurationSelected, onClose }) => {
  const [selectedDuration, setSelectedDuration] = useState('365');
  
  const durations = ['7', '14', '30', '60', '90', '180', '365'];
  
  const confirmDuration = () => {
    onDurationSelected(selectedDuration);
    onClose();
  };
  
  return (
    <View style={styles.durationPickerContainer}>
      <Text style={styles.durationPickerTitle}>Select Duration</Text>
      
      <View style={styles.durationOptionsContainer}>
        {durations.map(d => (
          <TouchableOpacity 
            key={d} 
            style={[
              styles.durationOption,
              selectedDuration === d && styles.selectedDurationOption
            ]}
            onPress={() => setSelectedDuration(d)}
          >
            <Text style={[
              styles.durationOptionText,
              selectedDuration === d && styles.selectedDurationOptionText
            ]}>
              {d} days
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.confirmDurationButton} onPress={confirmDuration}>
        <Text style={styles.confirmDurationText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

// Time picker component
const TimePicker = ({ title, onTimeSelected, onClose }) => {
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');
  
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  
  const confirmTime = () => {
    onTimeSelected(`${hour}:${minute}`);
    onClose();
  };
  
  return (
    <View style={styles.timePickerContainer}>
      <Text style={styles.timePickerTitle}>{title}</Text>
      
      <View style={styles.timePickerContent}>
        <View style={styles.timePickerColumn}>
          <Text style={styles.timePickerLabel}>Hour</Text>
          <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator={false}>
            {hours.map(h => (
              <TouchableOpacity 
                key={h} 
                style={[
                  styles.timeOption,
                  hour === h && styles.selectedTimeOption
                ]}
                onPress={() => setHour(h)}
              >
                <Text style={[
                  styles.timeOptionText,
                  hour === h && styles.selectedTimeOptionText
                ]}>
                  {h}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <Text style={styles.timePickerSeparator}>:</Text>
        
        <View style={styles.timePickerColumn}>
          <Text style={styles.timePickerLabel}>Minute</Text>
          <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator={false}>
            {minutes.map(m => (
              <TouchableOpacity 
                key={m} 
                style={[
                  styles.timeOption,
                  minute === m && styles.selectedTimeOption
                ]}
                onPress={() => setMinute(m)}
              >
                <Text style={[
                  styles.timeOptionText,
                  minute === m && styles.selectedTimeOptionText
                ]}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      <TouchableOpacity style={styles.confirmTimeButton} onPress={confirmTime}>
        <Text style={styles.confirmTimeText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export function CreateHabitScreen() {
  const navigation = useNavigation();
  const [habit, setHabit] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);
  const [duration, setDuration] = useState('365');
  const [days, setDays] = useState('everyday');
  const [selectedDays, setSelectedDays] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  
  const canFinish = habit.length > 0;
  
  // Calculate minutes between from and to time
  const calculateMinutes = () => {
    if (!fromTime || !toTime) return '45';
    
    const [fromHour, fromMinute] = fromTime.split(':').map(Number);
    const [toHour, toMinute] = toTime.split(':').map(Number);
    
    let totalMinutes = (toHour * 60 + toMinute) - (fromHour * 60 + fromMinute);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight
    
    return totalMinutes.toString();
  };
  
  const minutes = calculateMinutes();
  
  // Add habit function
  const addHabit = () => {
    // Here you would add the habit to your storage/database
    // For now, we'll just navigate back
    navigation.navigate('HabitList');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.skip}>Skip</Text>

      <Text style={styles.title}>Create habit</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>I will </Text>
        <TextInput
          style={styles.input}
          placeholder="train BJJ..."
          value={habit}
          onChangeText={setHabit}
          placeholderTextColor="#999"
        />
      </View>

      <Text style={styles.sectionLabel}>set time</Text>
      
      <View style={styles.timeRow}>
        <TouchableOpacity 
          onPress={() => setShowFromTimePicker(true)} 
          style={styles.timeSelector}
        >
          <Text style={styles.timeSelectorText}>
            {fromTime || 'from'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.timeSeparator}>-</Text>
        
        <TouchableOpacity 
          onPress={() => setShowToTimePicker(true)} 
          style={styles.timeSelector}
        >
          <Text style={styles.timeSelectorText}>
            {toTime || 'to'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[styles.optionButton, days === 'everyday' && styles.optionButtonActive]}
          onPress={() => setDays('everyday')}
        >
          <Text style={[styles.optionText, days === 'everyday' && styles.optionTextActive]}>
            everyday
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, days === 'custom' && styles.optionButtonActive]}
          onPress={() => {
            setDays('custom');
            setShowCalendar(true);
          }}
        >
          <Text style={[styles.optionText, days === 'custom' && styles.optionTextActive]}>
            select days
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[
            styles.optionButton, 
            duration === '365' && styles.optionButtonActive
          ]}
          onPress={() => {
            setDuration('365');
          }}
        >
          <Text style={[
            styles.optionText,
            duration === '365' && styles.optionTextActive
          ]}>
            365 days
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            duration !== '365' && styles.optionButtonActive
          ]}
          onPress={() => {
            setShowDurationPicker(true);
          }}
        >
          <Text style={[
            styles.optionText,
            duration !== '365' && styles.optionTextActive
          ]}>
            select duration
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          I will {habit || 'train BJJ'} for {minutes}min {days === 'everyday' ? 'everyday' : 'on selected days'} for {duration} days
        </Text>
        
        <TouchableOpacity 
          style={styles.addHabitButton}
          onPress={addHabit}
        >
          <Text style={styles.addHabitText}>add habit +</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.finishButton, !canFinish && { opacity: 0.5 }]}
          disabled={!canFinish}
          onPress={() => navigation.navigate('HabitList')}
        >
          <Text style={styles.finishText}>Finish setup</Text>
        </TouchableOpacity>
      </View>
      
      {/* From Time Picker Modal */}
      <Modal
        visible={showFromTimePicker}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <TimePicker 
            title="Set Start Time"
            onTimeSelected={setFromTime}
            onClose={() => setShowFromTimePicker(false)}
          />
        </View>
      </Modal>
      
      {/* To Time Picker Modal */}
      <Modal
        visible={showToTimePicker}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <TimePicker 
            title="Set End Time"
            onTimeSelected={setToTime}
            onClose={() => setShowToTimePicker(false)}
          />
        </View>
      </Modal>
      
      {/* Calendar Modal for Days */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <CalendarPicker 
            title="Select Days"
            selectedDays={selectedDays}
            onDayPress={setSelectedDays}
            onClose={() => setShowCalendar(false)}
          />
        </View>
      </Modal>
      
      {/* Duration Picker Modal */}
      <Modal
        visible={showDurationPicker}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <DurationPicker 
            onDurationSelected={setDuration}
            onClose={() => setShowDurationPicker(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  skip: {
    marginTop: 20,
    alignSelf: 'flex-end',
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: '#666',
    marginTop: 40,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 0,
  },
  sectionLabel: {
    fontSize: 16,
    color: '#808080',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    marginBottom: 15,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  timeSelector: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 5,
    flex: 1,
  },
  timeSelectorText: {
    fontSize: 14,
    color: '#999',
  },
  timeSeparator: {
    marginHorizontal: 10,
    color: '#999',
  },
  optionsRow: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 20,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    minWidth: 100,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextActive: {
    color: '#fff',
  },
  summaryContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  addHabitButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  addHabitText: {
    color: '#808080',
    fontWeight: '400',
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  finishButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  finishText: {
    color: '#000',
    fontSize: 14,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Time picker styles
  timePickerContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginBottom: 20,
  },
  timePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePickerColumn: {
    alignItems: 'center',
    width: 80,
  },
  timePickerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  timePickerScroll: {
    height: 150,
  },
  timeOption: {
    padding: 10,
    alignItems: 'center',
  },
  selectedTimeOption: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
  },
  timeOptionText: {
    fontSize: 18,
    color: '#666',
  },
  selectedTimeOptionText: {
    color: '#000',
    fontWeight: '500',
  },
  timePickerSeparator: {
    fontSize: 24,
    marginHorizontal: 10,
    color: '#666',
  },
  confirmTimeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  confirmTimeText: {
    color: '#fff',
    fontSize: 16,
  },
  // Calendar styles
  calendarContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginBottom: 20,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dayButton: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    width: 50,
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#000',
  },
  dayButtonText: {
    color: '#666',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '500',
  },
  doneButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  // Duration picker styles
  durationPickerContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  durationPickerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginBottom: 20,
  },
  durationOptionsContainer: {
    width: '100%',
  },
  durationOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  selectedDurationOption: {
    backgroundColor: '#F5F5F5',
  },
  durationOptionText: {
    fontSize: 16,
    color: '#666',
  },
  selectedDurationOptionText: {
    color: '#000',
    fontWeight: '500',
  },
  confirmDurationButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  confirmDurationText: {
    color: '#fff',
    fontSize: 16,
  },
});