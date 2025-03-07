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

export const getSubMenuAccessByUrl = (currentUrl, datas) => {
    console.log(datas)
    for (let menu of datas) {
        // Vérifier si l'URL correspond à un sous-menu
        const submenu = menu.subMenus.find(sub => sub.submenu_url === currentUrl);
        
        if (submenu) {
            return {
                can_read: submenu.can_read,
                can_edit: submenu.can_edit,
                can_comment: submenu.can_comment,
                can_delete: submenu.can_delete
            };
        }

        if (menu.menu_url === currentUrl) {
            return {
                can_read: menu.can_read,
                can_edit: menu.can_edit,
                can_comment: menu.can_comment,
                can_delete: menu.can_delete
            };
        }
    }

    console.log("Aucun menu ou sous-menu trouvé pour cette URL.");
    return null;
};
