import { useEffect, useState } from 'react';
import styles from "../styles/tab-groups.module.css"
import { useNavigate } from 'react-router-dom'
import browser from 'webextension-polyfill'
import truncateString from "~utils/common_functions"



const TabGroupsPopup = () => {

  const [groups, setGroups] = useState([])
  const navigate = useNavigate()


  const clearGroup = () => {
  	localStorage.clear()
  	window.close()
  }

  const applyAllTabGroups = (url) => {
  	for(let i=0; i < groups.length; i++){
  		const group = groups[i]
  		for (let x=0; x < group.tabs.length; x++){
	  		browser.tabs.create({ url: group.tabs[x].url })
	      .then(tab => {
	        console.log("New tab created:", tab);
	      })
	      .catch(error => {
	        console.error("Error creating new tab:", error);
	      });
  		}
  	}
  	localStorage.clear()
  }

  useEffect(() => {
		const groupNames = Object.keys(localStorage);

		const groupList = []
		for (let i = 0; i < groupNames.length; i++) {
			console.log(groupNames[i])
			const tabsPerGroup = localStorage.getItem(groupNames[i])
			const group = {groupName: groupNames[i] , tabs: JSON.parse(tabsPerGroup)}
			groupList.push(group)
		}
		console.log(groupList)
		setGroups(groupList)
  }, [])

  return (
	<div className={styles.container}>
		<div className={styles.topSection}>
			<span style={{fontSize: "15px", fontWeight:"bold"}}>Tab Groups</span>
			<button onClick={() => navigate('/', {state: {previousRoute: '/groups'}})} className={styles.addTabGroup}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
				<span>New Tab Group</span>
			</button>
			<button onClick={clearGroup} className={styles.clear}>Clear</button>
		</div>
		<div className={styles.listContainer}>
			{groups.map((group, index) => {
				return (
					<div className={styles.tabGroupCard} key={index}>
						<div style={{display: "flex", justifyContent:"space-around", margin:"10px"}}>
							<div className={styles.group}>
								<div className={styles.tabGroupImg}>
									{group.tabs.map((tab, tabIndex) => {
										return (
											tabIndex < 3 && (
												<div key={tabIndex} className={styles.imgContainer} style={{transform: tabIndex === 1 ? 'translateX(-10px)': tabIndex == 2 ? 'translateX(-20px)': 'translateX(0px)', marginRight: group.tabs.length == 1 ? "10px": "0px"}}>
													<img style={{
														height:"100%",
														width:"100%",
														objectFit:"contain",    
													}} src={tab.favicon} />

												</div>
											)
										)
									})}

						  		</div>
								{group.tabs.length > 3 && <span id="more-count" style={{marginLeft: '5px'}}>+{group.tabs.length - 3}</span>}
							</div>
							<div>
								<p style={{fontSize: "16px", fontWeight:"medium"}}>{truncateString(group.groupName, 12)}</p>
							</div>
						</div>
						<div className={styles.openTabGroup}>
							<button onClick={() => navigate('/tabs', {state: {groupName: group.groupName}})} style={{ background:"none", border: "none" }}>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"   style={{fill: 'rgba(255, 255, 255, 1)',transform: '',msFilter: ''}}>
								<path d="m13 3 3.293 3.293-7 7 1.414 1.414 7-7L21 11V3z"></path><path d="M19 19H5V5h7l-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5l-2-2v7z"></path></svg>
							</button>
						</div>
					</div>
				)
			})}

		</div>
		<button onClick={applyAllTabGroups} className={styles.apply}>Apply All Tab Groups</button>
	</div>
  );
};

export default TabGroupsPopup;
