const semesterByIdx = [{
  inNumber: 1,
  inString: 'Ganjil',
  isPaid: false
}, {
  inNumber: 2,
  inString: 'Genap',
  isPaid: false
}]

const paymentWithClasses = [
  { classGrade: "7-", payments: ["ppdb", "spp", "pas", "pat", "lks", "pph1", "pph2"] },
  { classGrade: "8-", payments: ["du", "spp", "pas", "pat", "lks", "pph1", "pph2"] },
  {
    classGrade: "9-",
    payments: ["du", "spp", "pas", "pat", "uam", "um", "lks", "pph1", "pph2"],
  },
];
const paymentKeys = ["ppdb", "spp", "pas", "pat", "lks", "pph1", "pph2", "du", "um", "uam"]
const monthsBySemester = [
  ["Juli", "Augustus", "September", "Oktober", "November", "Desember"],
  ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
];

const findSemester = (month: string) => {
  let semester: number
  for (const idx in monthsBySemester) {
    const months = monthsBySemester[idx]
    for (const i in months) {
      if (month == months[i]) {
        semester = parseInt(idx)
        return semesterByIdx[semester]
      }
    }
  }

  return null
}

export { semesterByIdx, paymentWithClasses, monthsBySemester, findSemester, paymentKeys }