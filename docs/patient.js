export function createPatientModel() {
    return {
        id: "",
        personal_info: {
            first_names: "",
            last_names: "",
            birth_date: "",
            natural_from: "",
            proceeds_from: "",
            numero: "",
            contacts: []
        },
        current_status: {
            active_diagnoses: [],
            current_treatment: [],
            allergies: [],
            surgical_history: [],
            app_history: []
        },
        events: []
    };
}

export function createEventModel(type = "ingreso") {
    return {
        event_id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        type: type, 
        // 'ingreso','evolucion_diaria','quirurgico','estudio'
        data: {
            iea: "",
            physical_exam: "",
            vital_signs: {},
            labs: {},
            imaging: {},
            surgical_details: null,
            pending_tasks: ""
        }
    };
}