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

   // HANDLERS
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
         case 'showContact':
            pageTitle = 'Show Contact'

            formInputs = {
               id: contactData.id,
               first_name: contactData.first_name,
               last_name: contactData.last_name,
               number: contactData.number,
               address: contactData.address,
               email: contactData.email,
               photo: contactData.photo,
               company: contactData.company,
            }
            break
         case 'editContact':
            pageTitle = 'Update Connection'
            formInputs = {
               id: contactData.id,
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
   handleCreate = (createContact) => {
     fetch('posts', {
       body: JSON.stringify(createContact),
       method: 'POST',
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
        this.fetchContacts()
     })
     .catch(err => console.log(err))
   }
   handleShow = (id) => {
      fetch(`posts/${id}`, {
       body: JSON.stringify(id),
       method: 'GET',
       headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
     })
     .then(updatedContact => {
       this.handleView('showContact')
     })
     .catch(err => console.log(err))
   }
   handleUpdate = (updateContact) => {
     fetch(`posts/${updateContact.id}`, {
       body: JSON.stringify(updateContact),
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
      fetch(`posts/${id}`, {
         method: 'DELETE',
         headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
         }
      })
      .then(data => {
         this.handleView('home')
         this.setState(prevState => {
            const contacts = prevState.contacts.filter(contact => contact.id !== id)
            return {contacts}
         })
     })
     .catch(err => console.log(err))
   }
   handleChange = (event) => {
      // console.log(event.target.id)
      // console.log(event.target.value)
      
      let formInputs = {
            id: this.state.formInputs.id,
            first_name: this.state.formInputs.first_name,
            last_name: this.state.formInputs.last_name,
            number: this.state.formInputs.number,
            address: this.state.formInputs.address,
            email: this.state.formInputs.email,
            photo: this.state.formInputs.photo || 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
            company: this.state.formInputs.company
         }
      formInputs[event.target.id] = event.target.value
      this.setState({formInputs: formInputs})
   };
   handleSubmit = (event) => {
      event.preventDefault()
      if (this.state.view.page === 'addContact') {
         this.handleCreate(this.state.formInputs)
      } else if (this.state.view.page === 'editContact') {
         this.handleUpdate(this.state.formInputs)
      }

   };
   fetchContacts = () => {
      fetch('/posts')
         .then(data => data.json())
         .then(jData => {
            // console.log(jData)
            this.setState({contacts: jData})
         })
   };

   componentDidMount() {
      this.fetchContacts()
   };

   render () {
      return (
         <div className='container'>
            <div className='navigation'>
               <ul>
                  <li onClick={() => {this.handleView('home')}}>home</li>
                  <li onClick={() => {this.handleView('addContact')}}>add contact</li>
               </ul>
            </div>
            {this.state.view.page === 'home'
               ? <div className='contacts'>
                  <h1>Rails and React 4Eva!</h1>
                     {this.state.contacts.map((contact) => {
                        return (
                           <div key={contact.id}
                              className='contact'
                              onClick={() => {this.handleView('showContact', contact)}}>
                              <img
                                 src={contact.photo}
                              />
                              <h3>{contact.first_name} {contact.last_name}</h3>
                              <h4>{contact.number}</h4>
                           </div>
                        )}
                     )}
                  </div>
               : this.state.view.page === 'showContact'
                  ?  <div className='show'>
                        <h1>Show Contact</h1>
                        <img
                           src={this.state.formInputs.photo}
                        />
                        <h1>{this.state.formInputs.first_name} {this.state.formInputs.last_name}</h1>
                        <h3>{this.state.formInputs.number}</h3>
                        <h3>{this.state.formInputs.email}</h3>
                        <h3>{this.state.formInputs.company}</h3>
                        <h3>{this.state.formInputs.address}</h3>
                        <div className='contact-changes'>
                           <ul>
                                 <li onClick={() => {this.handleView('editContact', this.state.formInputs)}}>
                                 Edit Contact
                              </li>
                                 <li onClick={() => {this.handleDelete( this.state.formInputs.id)}}>
                                 Delete Contact
                              </li>
                           </ul>
                        </div>
                     </div>
                  : <div className='form'>
                     {this.state.view.page === 'addContact'
                        ? <h1>Add New Contact</h1>
                        : <h1>Edit Contact</h1>}
                     <form onSubmit={this.handleSubmit}>
                        <label>
                           <input
                              type="text"
                              placeholder="First Name"
                              id="first_name"
                              value={this.state.formInputs.first_name}
                              onChange={this.handleChange}
                           />
                        </label>
                        <label>
                           <input
                              type="text"
                              placeholder="Last Name"
                              id="last_name"
                              value={this.state.formInputs.last_name}
                              onChange={this.handleChange}
                           />
                        </label>
                        <label>
                           <input
                              type="text"
                              placeholder="Phone Number"
                              id="number"
                              value={this.state.formInputs.number}
                              onChange={this.handleChange}
                           />
                        </label>
                        <label>
                           <input
                              type="text"
                              placeholder="Address"
                              id="address"
                              value={this.state.formInputs.address}
                              onChange={this.handleChange}
                           />
                        </label>
                        <label>
                           <input
                              type="text"
                              placeholder="Email"
                              id="email"
                              value={this.state.formInputs.email}
                              onChange={this.handleChange}
                           />
                        </label>
                        <label>
                           <input
                              type="text"
                              placeholder="Photo"
                              id="photo"
                              value={this.state.formInputs.photo}
                              onChange={this.handleChange}
                           />
                        </label>
                        <label>
                           <input
                              type="text"
                              placeholder="Company"
                              id="company"
                              value={this.state.formInputs.company}
                              onChange={this.handleChange}
                           />
                        </label>
                        <input
                           type="submit"
                           value={this.state.view.page === 'addContact'
                              ? 'add contact'
                              : 'update contact'}/>
                     </form>
                     <button onClick={this.state.view.page === 'editContact'
                     ? () => {this.handleView('showContact', this.state.formInputs)}
                     : () => {this.handleView('home')}}>Cancel</button>
                  </div>
            }
         </div>
      )
   };
}

export default App
