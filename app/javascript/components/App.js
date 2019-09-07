import React from 'react'

class App extends React.Component {
   constructor() {
      super()
      this.state = {
         contacts:[]
      }
   }

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
