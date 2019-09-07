import React from 'react'

class App extends React.Component {
   constructor() {
      super()
      this.state = {
         contacts:[],
         view: {
            page: 'home',
            pageTitle: 'Connections'
         },
         formInputs: {
            id: null,
            first_name: null,
            last_name: null,
            number: null,
            address: null,
            email: null,
            photo: null,
            company: null,
         }
      }
   };

   handleView = (view, contactData) => {
      let pageTitle = ''
      let formInputs = {
         id: null,
         first_name: '',
         last_name: '',
         number: '',
         address: '',
         email: '',
         photo: '',
         company: '',
      }

      switch (view) {
         case 'home':
            pageTitle = 'Connections'
            break
         case 'addContact':
            pageTitle = 'New Connection'
            break
         case 'editContact':
            pageTitle = 'Update Connection'
            formInputs = {
               id: null,
               first_name: contactData.first_name,
               last_name: contactData.last_name,
               number: contactData.number,
               address: contactData.address,
               email: contactData.email,
               photo: contactData.photo,
               company: contactData.company,
            }
            break
         default:
            break
      }
      this.setState({
         view: {
            page: view,
            pageTitle: pageTitle
         },
         formInputs: formInputs
      })
   };

   handleCreate = (createData) => {
     fetch('/posts', {
       body: JSON.stringify(createData),
       method: 'Post',
       headers: {
         'Accept': 'application/json, text/plain, */*',
         'Content-Type': 'application/json'
       }
     })
     .then(createdContact => {
       return createdContact.json()
     })
     .then(jsonedContact => {
       this.handleView('home')
       this.setState(prevState => {
         prevState.contacts.push(jsonedContact)
         return {contacts: prevState.contacts}
       })
     })
     .catch(err => console.log(err))
   }

   handleUpdate = (updateData) => {
     fetch(`/posts/${updateData.id}`, {
       body: JSON.stringify(updateData),
       method: 'PUT',
       headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
     })
     .then(updatedContact => {
       this.handleView('home')
       this.fetchContacts()
     })
     .catch(err => console.log(err))
   }

   handleDelete = (id) => {
     fetch(`/posts/${id}`, {
       method: 'DELETE',
       headers: {
         'Accept': 'application/json, text/plain, */*',
         'Content-Type': 'application/json'
       }
     })
     .then(data => {
       this.setState(prevState => {
         const contacts = prevState.contacts.filter(contact => contact.id !== id)
         return {contacts}
       })
     })
     .catch(err => console.log(err))
   }

   fetchContacts = () => {
      fetch('/posts')
         .then(data => data.json())
         .then(jData => {
            console.log(jData)
            this.setState({contacts: jData})
         })
   };

   componentDidMount() {
      this.fetchContacts()
   };

   render () {
      return (
         <div className='container'>
            <h1>Rails and React 4Eva!</h1>
            <div className='contact'>
               {this.state.contacts.map((contact) => {
                  return (
                     <div key={contact.id}>
                        <img
                           src={contact.photo}
                        />
                        <h3>{contact.first_name} {contact.last_name}</h3>
                        <h4>{contact.number}</h4>
                     </div>
                  )}
               )}
            </div>
         </div>
      )
   };
}

export default App
