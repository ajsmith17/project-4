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

   handleView = (view, postData) => {
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
         case 'addPost':
            pageTitle = 'New Connection'
            break
         case 'editPost':
            pageTitle = 'Update Connection'
            formInputs = {
               id: null,
               first_name: postData.first_name,
               last_name: postData.last_name,
               number: postData.number,
               address: postData.address,
               email: postData.email,
               photo: postData.photo,
               company: postData.company,
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

   fetchContacts = () => {
      fetch('posts')
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
