import { useEffect, useState } from "react"
import styles from '../styles/popup.module.css'
import { useNavigate, useLocation  } from 'react-router-dom'
import browser from 'webextension-polyfill'

function SaveTabFormPopup() {

  const [submitted, setSubmitted] = useState(false)
  const [name,setName] = useState('')
  const [errors, setErrors] = useState([])
  const navigate = useNavigate()
  const location = useLocation();
  const data = location.state;


  useEffect(() => {
    
    if(localStorage.length > 0 && !data) {
      navigate('/groups')
    }

  }, [])

  const inputEvent = (event) => { setName(event.target.value) }


  const submitHandler = (event) => {
    event.preventDefault()
    const newErrors = []

    if(name === "") {
      newErrors.push({type: "emptyInput"})
    }

    else if(localStorage.getItem(name)) {
      newErrors.push({type: "duplicate"})
    }

    else{

      browser.tabs.query({}).then(tabs => {
        const savedTabs = [];
        
        tabs.forEach(tab => {
          if (tab.title !== undefined && tab.url !== undefined) {
            const title = tab.title;
            const url = tab.url;
            const faviconUrl = tab.favIconUrl;

            const savedTab = {
              title,
              url,
              ...(faviconUrl && { favicon: faviconUrl }), // Add favicon only if available
            };
            console.log('Title:', title);
            console.log('URL:', url);
            console.log('Favicon URL:', faviconUrl);

            savedTabs.push(savedTab);
          }


        });

        localStorage.setItem(name, JSON.stringify(savedTabs));
        setSubmitted(true)

      }).catch(error => {

        console.error('Error querying tabs:', error);
      
      });

    }

    setErrors(newErrors)

  }

  return (
    <div>
      <p className={styles.textStyle}>No Saved Tabs</p>
      <form onSubmit={submitHandler} id="save-tabs-form">
        <label>Tab Group Name</label>
        {(errors.length > 0 && errors.some(error => error.type === 'emptyInput')) 
          ? <p className={styles.errorMessage}>Input can't be empty</p>: (errors.length > 0
          && errors.some(error => error.type === 'duplicate')) 
          ? <p className={styles.errorMessage}>A group with the same name already exists</p>
          : void(0)
        }
        <input onChange={inputEvent} id="group-name" type="input" placeholder="Enter a name for the Tab group" name=""></input>
        {submitted ? (
          <button className={styles.submitButton} style={{backgroundColor: 'darkgray'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{fill: 'rgba(255, 255, 255, 1)',transform: '',msFilter: ''}}><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
          </button>
          ) : (
            <input className={styles.submitButton} type="submit" value="Create a tab group" />
          )
        }
      </form>
    </div>
  )
}

export default SaveTabFormPopup
