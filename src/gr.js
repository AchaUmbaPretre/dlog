let data = [
    {
      id: 1,
      nom: "Grady",
      email: "gradimuamba@gmail.com",
      profession: "Développeur",
      contacts: +243834444459
    },
    {
        id: 1,
        nom: "Grady",
        email: "gradimuamba@gmail.com",
        profession: "Développeur",
        contacts: +243834444459
      },
      {
        id: 2,
        nom: "Grady",
        email: "gradimuamba@gmail.com",
        profession: "Développeur",
        contacts: +243834444459
      },
      {
        id: 3,
        nom: "Grady",
        email: "gradimuamba@gmail.com",
        profession: "Développeur",
        contacts: +243834444459
      },
    
  ];
  
  const tableBody = document.getElementById('table-body');
  
  function afficherTable() {
    tableBody.innerHTML = '';
    let totalContacts = 0;
  
    data.forEach((personne, index) => {
      const row = document.createElement('tr');
  
      row.innerHTML = `
        <th scope="row">${personne.id}</th>
        <td>${personne.nom}</td>
        <td>${personne.email}</td>
        <td>${personne.profession}</td>
        <td>${personne.contacts}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="modifierPersonne(${index})">Bureau</button>
          <button class="btn btn-sm btn-danger" onclick="supprimerPersonne(${index})">Bureau</button>
        </td>
      `;
  
      tableBody.appendChild(row);
  
      totalContacts += personne.contacts;
    });
  
    document.getElementById('total-contacts').innerText = totalContacts;
  }
  
  afficherTable();
  
  // Fonction pour ajouter ou modifier une personne
  document.getElementById('person-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const id = document.getElementById('person-id').value;
    const nom = document.getElementById('nom').value;
    const age = parseInt(document.getElementById('age').value);
    const profession = document.getElementById('profession').value;
    const ville = document.getElementById('ville').value;
    const contacts = parseInt(document.getElementById('contacts').value);
    const actif = document.getElementById('actif').value === 'true';
  
    if (id) {
      // Modification d'une personne existante
      const index = data.findIndex(personne => personne.id === parseInt(id));
      data[index] = { id: parseInt(id), nom, age, profession, ville, contacts, actif };
    } else {
      // Ajout d'une nouvelle personne
      const newPerson = {
        id: data.length ? data[data.length - 1].id + 1 : 1,
        nom,
        age,
        profession,
        ville,
        contacts,
        actif
      };
      data.push(newPerson);
    }
  
    // Réinitialiser le formulaire
    document.getElementById('person-id').value = '';
    this.reset();
  
    // Mettre à jour le tableau
    afficherTable();
  });
  
  // Fonction pour modifier une personne (remplir le formulaire)
  function modifierPersonne(index) {
    const personne = data[index];
    document.getElementById('person-id').value = personne.id;
    document.getElementById('nom').value = personne.nom;
    document.getElementById('age').value = personne.age;
    document.getElementById('profession').value = personne.profession;
    document.getElementById('ville').value = personne.ville;
    document.getElementById('contacts').value = personne.contacts;
    document.getElementById('actif').value = personne.actif ? 'true' : 'false';
  }
  
  // Fonction pour supprimer une personne
  function supprimerPersonne(index) {
    data.splice(index, 1);
    afficherTable();
  }
  