export const groupTasks = (tasks) => {
    const taskMap = new Map();

        tasks.forEach(task => {
        taskMap.set(task.id_tache, { ...task, sousTaches: [] });
    });
  
    tasks.forEach(task => {
        if (task.id_tache_parente !== null) {
            const parentTask = taskMap.get(task.id_tache_parente);
            if (parentTask) {
                parentTask.sousTaches.push(taskMap.get(task.id_tache));
            }
        }
    });
  
    return Array.from(taskMap.values()).filter(task => task.id_tache_parente === null);
  }