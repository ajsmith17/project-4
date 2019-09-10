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
            photo: this.state.formInputs.photo,
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
                  <li onClick={() => {this.handleView('home')}}>Home</li>
                  <li onClick={() => {this.handleView('addContact')}}>Add Contact</li>
               </ul>
               <h1>Connectr</h1>
            </div>
            {this.state.view.page === 'home'
               ? <div className='main'>

                      <div className='contacts'>
                       <div className='contacts-holder'>
                       {this.state.contacts.map((contact) => {
                          return (
                             <div key={contact.id}
                                className='contact'
                                onClick={() => {this.handleView('showContact', contact)}}>
                                <img
                                   src={contact.photo === ''
                                 ? 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png' : contact.photo}
                                />
                                <h3>{contact.first_name} {contact.last_name}</h3>
                                <h4>{contact.company}</h4>
                             </div>
                          )}
                       )}
                      </div>
                     </div>
                  </div>
               : this.state.view.page === 'showContact'
                  ?  <div className='show'>

                        <img
                           src={this.state.formInputs.photo === ''
                         ? 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png' : this.state.formInputs.photo}
                        />
                        <h2>{this.state.formInputs.first_name} {this.state.formInputs.last_name}</h2>
                        <h3>{this.state.formInputs.company}</h3>
                        <h3>{this.state.formInputs.number}</h3>
                        <h3>{this.state.formInputs.email}</h3>
                        <h3>{this.state.formInputs.address}</h3>
                        <div className='contact-changes'>
                           <ul>
                                 <li className='editBtn' onClick={() => {this.handleView('editContact', this.state.formInputs)}}>
                                 Edit Contact
                              </li>
                                 <li className='deleteBtn' onClick={() => {this.handleDelete( this.state.formInputs.id)}}>
                                 Delete Contact
                              </li>
                           </ul>
                        </div>
                     </div>
                  : <div className='form'>
                     {this.state.view.page === 'addContact'
                        ? <h2>Add New Contact</h2>
                        : <h2>Edit Contact</h2>}
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
                              ? 'Add Contact'
                              : 'Update Contact'}/>
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
