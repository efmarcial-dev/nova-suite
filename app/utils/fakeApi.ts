
export async function createTask(taskData: {
    title: string;
    selectedAssigneeId?: number | null;
    status: string | null;
    selectedProjectId?: number | null;
    tags: string[];
    dueDate: Date | null;
    description: string;
    attachment: File | null;
}): Promise<{id: string}> {


    return new Promise((resolve)=> {

        setTimeout(() => {
            resolve({
                id: crypto.randomUUID(), // simulates a created task ID
            });
        console.log(taskData)
        }, 1000) ; // 1-second delay to simulate backend
        
    })
}