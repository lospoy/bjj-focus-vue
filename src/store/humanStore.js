// HUMAN STORE
import { getHuman } from "../services/humanService";
import { getAllSessions } from "../services/sessionService";

const methods = { // [ "Fizz Mcbuzz", "Pepe papa", ]
  async getStudentName(id) {
    const human = await getHuman(id)
    const humanName = human.name.first + " " + human.name.last
    return humanName
  },

  async getStudentLastAttendedSession(id) {
    const allSessions = await getAllSessions()
    const sessionsAttendedByUser = allSessions.filter(session => JSON.stringify(session.who.students).includes(id))
    const latestSessionAttended = sessionsAttendedByUser[sessionsAttendedByUser.length-1]
    return latestSessionAttended
  },

}

export default {
  methods,
};
