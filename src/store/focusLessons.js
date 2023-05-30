// Used in @components/AttendanceStats.vue
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFocusLessonsStore = defineStore('focusLessons', () => {
	const topics = ref({
		thisWeek: '',
		nextWeek: '',
	})
	const focusLessons = ref([
		{
			name: 'Back Control',
			id: '63476ca77c0c4048382acb04',
		},
		{
			name: 'Half Guard',
			id: '634ed31717260c95e351de8d',
		},
		{
			name: 'Side Control',
			id: '634ed53c17260c95e351decb',
		},
		{
			name: 'Closed Guard',
			id: '634ed77517260c95e351dfa3',
		},
		{
			name: 'Mount',
			id: '634ecefa9f04894fb818c868',
		},
		{
			name: 'De La Riva',
			id: '634edb2337829d81a79048ab',
		},
		{
			name: 'Open Guard',
			id: '638eaab8964f267814d40a89',
		},
		{
			name: 'Turtle',
			id: '638ead84964f267814d40ad7',
		},
	])

	function setFocusLessons(payload) {
		if (!payload) {
			return (focusLessons.value = null)
		}
		focusLessons.value = [
			{
				name: 'Back Control',
				id: '63476ca77c0c4048382acb04',
				skills: payload[0].skills,
				techniqueIDs: payload[0].content.techniques.map((obj) => obj._id),
				info: `Back Control is all about bla bla`,
			},
			{
				name: 'Half Guard',
				id: '634ed31717260c95e351de8d',
				skills: payload[2].skills,
				techniqueIDs: payload[2].content.techniques.map((obj) => obj._id),
				info: `${focusLessons.value[1].name} should say Half Guard`,
			},
			{
				name: 'Closed Guard',
				id: '634ed77517260c95e351dfa3',
				skills: payload[4].skills,
				techniqueIDs: payload[4].content.techniques.map((obj) => obj._id),
				info: {
					guard: 'Posture control, angle, crossing their elbow',
					passing: 'Inside control, posturing up',
				},
			},
			{
				name: 'De La Riva',
				id: '634edb2337829d81a79048ab',
				skills: payload[5].skills,
				techniqueIDs: payload[5].content.techniques.map((obj) => obj._id),
				info: `${focusLessons.value[3].name} should say Back Control`,
			},
			{
				name: 'Open Guard',
				id: '638eaab8964f267814d40a89',
				skills: payload[6].skills,
				techniqueIDs: payload[6].content.techniques.map((obj) => obj._id),
				info: `${focusLessons.value[4].name} should say Back Control`,
			},
			{
				name: 'Side Control & N/S',
				id: '634ed53c17260c95e351decb',
				skills: payload[3].skills,
				techniqueIDs: payload[3].content.techniques.map((obj) => obj._id),
				info: `${focusLessons.value[5].name} should say Back Control`,
			},
			{
				name: 'Mount',
				id: '634ecefa9f04894fb818c868',
				skills: payload[1].skills,
				techniqueIDs: payload[1].content.techniques.map((obj) => obj._id),
				info: `${focusLessons.value[6].name} should say Back Control`,
			},
			{
				name: 'Turtle',
				id: '638ead84964f267814d40ad7',
				skills: payload[7].skills,
				techniqueIDs: payload[7].content.techniques.map((obj) => obj._id),
				info: `${focusLessons.value[7].name} should say Back Control`,
			},
		]
	}
	// Gets the week number we are currently on since the startDate
	function currentWeekNumber() {
		// Day the classes started
		const startDate = new Date('September 12, 2022 00:00:00')
		const endDate = new Date()
		const diffInMs = new Date(endDate) - new Date(startDate)
		const diffInWeeks = diffInMs / (1000 * 60 * 60 * 24) / 7

		return diffInWeeks
	}

	function getTopic(week) {
		let topicIndex
		if (week === 'current') topicIndex = Math.floor(currentWeekNumber() % 8)
		// Using modulus to "loop back" to index 0 after reaching last index
		if (week === 'next') topicIndex = Math.floor((currentWeekNumber() + 1) % 8)

		return focusLessons.value[topicIndex]
	}

	function setTopics(current, next) {
		topics.value.thisWeek = current
		topics.value.nextWeek = next
	}

	function getLessonByID(id) {
		const lesson = focusLessons.value.find((lesson) => lesson.id === id)
		return lesson
	}

	return {
		focusLessons,
		setFocusLessons,
		topics,
		getTopic,
		setTopics,
		getLessonByID,
	}
})
