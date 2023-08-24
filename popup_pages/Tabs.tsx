import { useEffect, startTransition, useState } from 'react';
import styles from '../styles/tabs.module.css'
import { useLocation } from 'react-router-dom'
// import styles from '~styles/tabs.module.css'
import browser from 'webextension-polyfill'
import truncateString from "~utils/common_functions"

const SavedTabsPopup = () => {

  const [tabs, setTabs] = useState([])
  const location = useLocation();
  const data = location.state;


  const applyTabToBrowser = (tab_url) => {
    browser.tabs.create({ url: tab_url })
    .then(tab => {
      console.log("New tab created:", tab);
    })
    .catch(error => {
      console.error("Error creating new tab:", error);
    });
    
    removeTab(tab_url)
  }

  const clearAllTabs = () => {
    localStorage.removeItem(data.groupName)
    window.close()
  }

  const applyAllTabsToBrowser = (tab_url) => {
    for (let i=0; i < tabs.length; i++){
      browser.tabs.create({ url: tabs[i].url })
      .then(tab => {
        console.log("New tab created:", tab);
      })
      .catch(error => {
        console.error("Error creating new tab:", error);
      });
    }
    localStorage.removeItem(data.groupName)
  }


  const removeTab = (tab_url) => {
    if(tabs.length > 1) {
      const refreshedList = tabs.filter(tab => tab.url !== tab_url)
      localStorage.setItem(data.groupName, JSON.stringify(refreshedList))
      setTabs(refreshedList)
    }
    else{
      window.close();
      localStorage.removeItem(data.groupName)
    }
  }


  useEffect(() => {
      
    if (data) {
      const unparsedTabsList = localStorage.getItem(data.groupName);
      const tabsList = JSON.parse(unparsedTabsList);
      console.log("tabs: ", tabsList)
      setTabs(tabsList);
    }
  
  }, [])

  return (
    <div className={styles.container}>
    <div>
      <span  style={{fontSize: "15px", fontWeight:"bold"}}>{tabs.length} Tabs</span>
      <button onClick={clearAllTabs} className={styles.clear}>Clear All</button>
    </div>
    <div className={styles.listContainer} style={{paddingRight: tabs.length > 4 ? "10px" : "0px"}}>
      {tabs.map((tab, index) => {
        return (
          <div key={index} className={styles.savedTab}>
            <div className={styles.favContainer}>
              <img src={tab.favicon} alt="website-favicon"></img>
            </div>
            <div className={styles.siteDetails}>
              <span id="website-name">{new URL(tab.url).hostname}</span>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"  style={{fill: 'rgba(129, 128, 128, 1)', transform: '', msFilter: '', }}>
                   <path d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465s-2.592.521-3.535 1.465L4.929 12a5.008 5.008 0 0 0 0 7.071 4.983 4.983 0 0 0 3.535 1.462A4.982 4.982 0 0 0 12 19.071l.707-.707-1.414-1.414-.707.707a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.122-2.121z"></path>
                   <path d="m12 4.929-.707.707 1.414 1.414.707-.707a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.122 2.121c-1.133 1.133-3.109 1.133-4.242 0L10.586 12l-1.414 1.414.707.707c.943.944 2.199 1.465 3.535 1.465s2.592-.521 3.535-1.465L19.071 12a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0z"></path>
                </svg>
                <span style={{fontSize: "10px", color:"gray"}}>{truncateString(tab.url, 24)}</span>
              </div>
            </div>
            <div className={styles.actionButtons}>
              <button onClick={() => removeTab(tab.url)} title="remove this saved tab">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill: 'rgba(243, 28, 28, 1)', transform: '', msFilter: ''}}>
                   <path d="M5 11h14v2H5z"></path>
                </svg>
              </button>
              <button onClick={() => applyTabToBrowser(tab.url)} title="apply tab on your browser">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"   style={{fill: 'rgba(26, 158, 5, 1)', transform: '', msFilter: 'your-ms-filter-value'}}>
                   <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
                </svg>
                </button>
            </div>
          </div>
        )
      })}
    </div>

    <button onClick={applyAllTabsToBrowser}>Apply All Tabs</button>

  </div>

  );
};

export default SavedTabsPopup;
