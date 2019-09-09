import React from 'react'

class Form extends React.Component {


   handleChange = (event) => {
      this.setState({[event.target.id] : event.target.value})
   };

   handleSubmit = (event) => {
      event.preventDefault()
      if (this.state.view.page === 'addPost') {
         this.state.handleCreate(this.state.formInputs)
      } else if (this.state.view.page === 'editPost') {
         this.state.handleUpdate(this.state.formInputs)
      }

   };

   render() {
      return (
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
                  id="phone_number"
                  value={this.state.formInputs.number}
                  onChange={this.handleChange}
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
      )
   }

}
