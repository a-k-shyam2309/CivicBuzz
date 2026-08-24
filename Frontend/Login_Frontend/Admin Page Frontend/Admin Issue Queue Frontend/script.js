document.addEventListener("DOMContentLoaded", () => {

	/* =====================================================
	   ELEMENT REFERENCES
	===================================================== */

	const issueSearch =
		document.getElementById("issueSearch");

	const searchButton =
		document.getElementById("searchButton");

	const statusFilter =
		document.getElementById("statusFilter");

	const priorityFilter =
		document.getElementById("priorityFilter");

	const categoryFilter =
		document.getElementById("categoryFilter");

	const dateFilter =
		document.getElementById("dateFilter");

	const tableBody =
		document.getElementById("issuesTableBody");


	/* =====================================================
	   RIGHT SIDE PANEL
	===================================================== */

	const issuePanel =
		document.getElementById("issueDetailsPanel");

	const issuePanelOverlay =
		document.getElementById("issuePanelOverlay");

	const closeIssuePanel =
		document.getElementById("closeIssuePanel");


	/* =====================================================
	   PANEL INFORMATION
	===================================================== */

	const panelIssueId =
		document.getElementById("panelIssueId");

	const panelIssueTitle =
		document.getElementById("panelIssueTitle");

	const panelUserId =
		document.getElementById("panelUserId");

	const panelDate =
		document.getElementById("panelDate");

	const panelLocation =
		document.getElementById("panelLocation");

	const panelCategory =
		document.getElementById("panelCategory");

	const panelPriority =
		document.getElementById("panelPriority");

	const panelStatus =
		document.getElementById("panelStatus");

	const panelAssigned =
		document.getElementById("panelAssigned");

	const panelDescription =
		document.getElementById("panelDescription");


	/* =====================================================
	   IMAGE
	===================================================== */

	const panelImageContainer =
		document.getElementById(
			"panelImageContainer"
		);

	const panelIssueImage =
		document.getElementById(
			"panelIssueImage"
		);

	const noImageMessage =
		document.getElementById(
			"noImageMessage"
		);


	/* =====================================================
	   STATUS
	===================================================== */

	const panelStatusSelect =
		document.getElementById(
			"panelStatusSelect"
		);


	/* =====================================================
	   VERIFICATION
	===================================================== */

	const verificationSection =
		document.getElementById(
			"verificationSection"
		);

	const verificationCount =
		document.getElementById(
			"verificationCount"
		);

	const verificationProgressBar =
		document.getElementById(
			"verificationProgressBar"
		);

	const verificationMessage =
		document.getElementById(
			"verificationMessage"
		);

	const citizenVerificationList =
		document.getElementById(
			"citizenVerificationList"
		);

	const verificationComplete =
		document.getElementById(
			"verificationComplete"
		);


	/* =====================================================
	   ACTION BUTTONS
	===================================================== */

	const assignIssueBtn =
		document.getElementById(
			"assignIssueBtn"
		);

	const rejectIssueBtn =
		document.getElementById(
			"rejectIssueBtn"
		);

	const resolveIssueBtn =
		document.getElementById(
			"resolveIssueBtn"
		);

	const closeComplaintBtn =
		document.getElementById(
			"closeComplaintBtn"
		);


	/* =====================================================
	   WORKFLOW ALERT
	===================================================== */

	const workflowAlertOverlay =
		document.getElementById(
			"workflowAlertOverlay"
		);

	const workflowAlertIcon =
		document.getElementById(
			"workflowAlertIcon"
		);

	const workflowAlertTitle =
		document.getElementById(
			"workflowAlertTitle"
		);

	const workflowAlertMessage =
		document.getElementById(
			"workflowAlertMessage"
		);

	const workflowAlertClose =
		document.getElementById(
			"workflowAlertClose"
		);


	/* =====================================================
	   STATUS NAMES
	===================================================== */

	const statusNames = {

		pending: "Pending",

		progress: "In Progress",

		resolved: "Resolved",

		verified: "Verified",

		closed: "Closed",

		rejected: "Rejected"

	};


	/* =====================================================
	   PRIORITY NAMES
	===================================================== */

	const priorityNames = {

		low: "Low",

		medium: "Medium",

		high: "High",

		critical: "Critical"

	};


	/* =====================================================
	   VERIFICATION SETTINGS
	===================================================== */

	const REQUIRED_VERIFICATIONS = 3;


	/* =====================================================
	   ISSUE DATA
	===================================================== */

	const issueData = {


		"ISS-1024": {

			id: "ISS-1024",

			title:
				"Street Light Not Working",

			userId:
				"USR-2045",

			date:
				"18 Aug 2026, 10:30 AM",

			location:
				"Sakchi, Jamshedpur",

			category:
				"Electricity",

			priority:
				"high",

			status:
				"pending",

			assigned:
				"Municipal Electricity Team",

			description:
				"Street light near Sakchi Market has not been working for the last 3 days. Please fix it as soon as possible.",

			image: "",

			verifications: [

				{
					userId: "USR-2045",
					role: "Reporter",
					status: "waiting"
				},

				{
					userId: "USR-2198",
					role: "Nearby Citizen",
					status: "waiting"
				},

				{
					userId: "USR-2314",
					role: "Nearby Citizen",
					status: "waiting"
				}

			]

		},


		"ISS-1023": {

			id: "ISS-1023",

			title:
				"Garbage Not Collected",

			userId:
				"USR-1821",

			date:
				"17 Aug 2026, 04:20 PM",

			location:
				"Bistupur, Jamshedpur",

			category:
				"Garbage",

			priority:
				"medium",

			status:
				"progress",

			assigned:
				"Sanitation Department",

			description:
				"Garbage has not been collected from the area for the last two days.",

			image: "",

			verifications: [

				{
					userId: "USR-1821",
					role: "Reporter",
					status: "waiting"
				},

				{
					userId: "USR-2241",
					role: "Nearby Citizen",
					status: "waiting"
				},

				{
					userId: "USR-2390",
					role: "Nearby Citizen",
					status: "waiting"
				}

			]

		},


		"ISS-1022": {

			id: "ISS-1022",

			title:
				"Road Damage",

			userId:
				"USR-1942",

			date:
				"17 Aug 2026, 11:45 AM",

			location:
				"Mango, Jamshedpur",

			category:
				"Road",

			priority:
				"critical",

			status:
				"resolved",

			assigned:
				"Road Maintenance Team",

			description:
				"A large damaged section of the road is creating problems for vehicles and pedestrians.",

			image: "",

			verifications: [

				{
					userId: "USR-1942",
					role: "Reporter",
					status: "verified"
				},

				{
					userId: "USR-2155",
					role: "Nearby Citizen",
					status: "verified"
				},

				{
					userId: "USR-2288",
					role: "Nearby Citizen",
					status: "waiting"
				}

			]

		},


		"ISS-1021": {

			id: "ISS-1021",

			title:
				"Water Leakage",

			userId:
				"USR-1654",

			date:
				"16 Aug 2026, 09:15 AM",

			location:
				"Sonari, Jamshedpur",

			category:
				"Water",

			priority:
				"medium",

			status:
				"pending",

			assigned:
				"Water Supply Department",

			description:
				"Water is leaking continuously from a damaged pipeline near the residential area.",

			image: "",

			verifications: [

				{
					userId: "USR-1654",
					role: "Reporter",
					status: "waiting"
				},

				{
					userId: "USR-2017",
					role: "Nearby Citizen",
					status: "waiting"
				},

				{
					userId: "USR-2331",
					role: "Nearby Citizen",
					status: "waiting"
				}

			]

		},


		"ISS-1020": {

			id: "ISS-1020",

			title:
				"Overflowing Drain",

			userId:
				"USR-1532",

			date:
				"16 Aug 2026, 08:40 AM",

			location:
				"Kadma, Jamshedpur",

			category:
				"Drainage",

			priority:
				"medium",

			status:
				"progress",

			assigned:
				"Drainage Department",

			description:
				"The drainage line is overflowing and causing water to accumulate on the road.",

			image: "",

			verifications: [

				{
					userId: "USR-1532",
					role: "Reporter",
					status: "waiting"
				},

				{
					userId: "USR-2022",
					role: "Nearby Citizen",
					status: "waiting"
				},

				{
					userId: "USR-2440",
					role: "Nearby Citizen",
					status: "waiting"
				}

			]

		},


		"ISS-1019": {

			id: "ISS-1019",

			title:
				"Broken Footpath",

			userId:
				"USR-2011",

			date:
				"15 Aug 2026, 03:10 PM",

			location:
				"Telco, Jamshedpur",

			category:
				"Road",

			priority:
				"low",

			status:
				"resolved",

			assigned:
				"Road Maintenance Team",

			description:
				"The footpath is broken and needs repair for pedestrian safety.",

			image: "",

			verifications: [

				{
					userId: "USR-2011",
					role: "Reporter",
					status: "verified"
				},

				{
					userId: "USR-2111",
					role: "Nearby Citizen",
					status: "verified"
				},

				{
					userId: "USR-2202",
					role: "Nearby Citizen",
					status: "verified"
				}

			]

		},


		"ISS-1016": {

			id: "ISS-1016",

			title:
				"Damaged Street Sign",

			userId:
				"USR-1765",

			date:
				"14 Aug 2026, 11:20 AM",

			location:
				"Sakchi Main Road, Jamshedpur",

			category:
				"Road",

			priority:
				"medium",

			status:
				"verified",

			assigned:
				"Road Maintenance Team",

			description:
				"The street sign near the main road was damaged and difficult for citizens to read.",

			image: "",

			verifications: [

				{
					userId: "USR-1765",
					role: "Reporter",
					status: "verified"
				},

				{
					userId: "USR-2098",
					role: "Nearby Citizen",
					status: "verified"
				},

				{
					userId: "USR-2251",
					role: "Nearby Citizen",
					status: "verified"
				}

			]

		},


		"ISS-1015": {

			id: "ISS-1015",

			title:
				"Public Park Light Repair",

			userId:
				"USR-1632",

			date:
				"13 Aug 2026, 04:45 PM",

			location:
				"Jubilee Park, Jamshedpur",

			category:
				"Electricity",

			priority:
				"low",

			status:
				"verified",

			assigned:
				"Electricity Team",

			description:
				"The lighting system inside the public park was not working properly during evening hours.",

			image: "",

			verifications: [

				{
					userId: "USR-1632",
					role: "Reporter",
					status: "verified"
				},

				{
					userId: "USR-1987",
					role: "Nearby Citizen",
					status: "verified"
				},

				{
					userId: "USR-2145",
					role: "Nearby Citizen",
					status: "verified"
				}

			]

		},

		
        "ISS-1017": {

			id: "ISS-1017",

			title:
				"Garbage Bin Full",

			userId:
				"USR-1888",

			date:
				"14 Aug 2026, 05:30 PM",

			location:
				"Sakchi, Jamshedpur",

			category:
				"Garbage",

			priority:
				"low",

			status:
				"resolved",

			assigned:
				"Sanitation Department",

			description:
				"The public garbage bin was completely full and required immediate collection.",

			image: "",

			verifications: [

				{
					userId: "USR-1888",
					role: "Reporter",
					status: "verified"
				},

				{
					userId: "USR-2090",
					role: "Nearby Citizen",
					status: "waiting"
				},

				{
					userId: "USR-2205",
					role: "Nearby Citizen",
					status: "waiting"
				}

			]

		}

	};


	/* =====================================================
	   CURRENT ISSUE
	===================================================== */

	let currentIssueId = null;


	/* =====================================================
	   OPEN ISSUE PANEL
	===================================================== */

	function openIssuePanel(issueId) {

		const issue =
			issueData[issueId];


		if (!issue) {

			console.warn(
				"Issue not found:",
				issueId
			);

			return;
		}


		currentIssueId =
			issueId;


		/* ---------------------------------------------
		   ISSUE INFORMATION
		--------------------------------------------- */

		if (panelIssueId) {

			panelIssueId.textContent =
				`#${issue.id}`;

		}


		if (panelIssueTitle) {

			panelIssueTitle.textContent =
				issue.title;

		}


		if (panelUserId) {

			panelUserId.textContent =
				issue.userId;

		}


		if (panelDate) {

			panelDate.textContent =
				issue.date;

		}


		if (panelLocation) {

			panelLocation.textContent =
				issue.location;

		}


		if (panelCategory) {

			panelCategory.textContent =
				issue.category;

		}


		if (panelAssigned) {

			panelAssigned.textContent =
				issue.assigned;

		}


		if (panelDescription) {

			panelDescription.textContent =
				issue.description;

		}


		/* ---------------------------------------------
		   PRIORITY
		--------------------------------------------- */

		updatePanelPriority(
			issue.priority
		);


		/* ---------------------------------------------
		   STATUS
		--------------------------------------------- */

		updatePanelStatus(
			issue.status
		);


		/* ---------------------------------------------
		   IMAGE
		--------------------------------------------- */

		updatePanelImage(
			issue.image
		);


		/* ---------------------------------------------
		   VERIFICATION
		--------------------------------------------- */

		updateVerificationUI(
			issue
		);


		/* ---------------------------------------------
		   OPEN PANEL
		--------------------------------------------- */

		if (issuePanel) {

			issuePanel.classList.add(
				"active"
			);

		}


		if (issuePanelOverlay) {

			issuePanelOverlay.classList.add(
				"active"
			);

		}


		document.body.style.overflow =
			"hidden";

	}


	/* =====================================================
	   UPDATE PANEL PRIORITY
	===================================================== */

	function updatePanelPriority(
		priority
	) {

		if (!panelPriority) {
			return;
		}


		panelPriority.textContent =
			priorityNames[priority] ||
			priority;


		panelPriority.className =
			"priority " + priority;

	}


	/* =====================================================
	   UPDATE PANEL STATUS
	===================================================== */

	function updatePanelStatus(
		status
	) {

		if (panelStatus) {

			panelStatus.textContent =
				statusNames[status] ||
				status;


			panelStatus.className =
				"status " + status;

		}


		if (panelStatusSelect) {

			panelStatusSelect.value =
				status;

		}


		if (issuePanel) {

			issuePanel.classList.remove(
				"verified",
				"closed"
			);


			if (status === "verified") {

				issuePanel.classList.add(
					"verified"
				);

			}


			if (status === "closed") {

				issuePanel.classList.add(
					"closed"
				);

			}

		}

	}

	/* =====================================================
   IMAGE HANDLING
===================================================== */

	function updatePanelImage(
		imageSource
	) {

		/*
		 * If client uploaded an image,
		 * show the actual image.
		 */

		if (
			imageSource &&
			typeof imageSource === "string" &&
			imageSource.trim() !== ""
		) {

			if (panelIssueImage) {

				panelIssueImage.src =
					imageSource;

				panelIssueImage.alt =
					"Reported issue image";

				panelIssueImage.style.display =
					"block";

			}


			if (noImageMessage) {

				noImageMessage.style.display =
					"none";

			}

		}

		/*
		 * If client did NOT upload an image,
		 * show "Image not uploaded".
		 */

		else {

			if (panelIssueImage) {

				panelIssueImage.removeAttribute(
					"src"
				);

				panelIssueImage.alt =
					"";

				panelIssueImage.style.display =
					"none";

			}


			if (noImageMessage) {

				noImageMessage.style.display =
					"flex";

			}

		}

	}


	/* =====================================================
	   IMAGE LOAD ERROR
	===================================================== */

	if (panelIssueImage) {

		panelIssueImage.addEventListener(
			"error",
			() => {

				panelIssueImage.style.display =
					"none";


				if (noImageMessage) {

					noImageMessage.style.display =
						"flex";

				}

			}
		);

	}


	/* =====================================================
	   VERIFICATION COUNT
	===================================================== */

	function getVerificationCount(
		issue
	) {

		if (
			!issue ||
			!Array.isArray(
				issue.verifications
			)
		) {

			return 0;

		}


		return issue.verifications.filter(
			citizen =>
				citizen.status === "verified"
		).length;

	}


	/* =====================================================
	   UPDATE VERIFICATION UI
	===================================================== */

	function updateVerificationUI(
		issue
	) {

		if (!verificationSection) {
			return;
		}


		const verifications =
			issue.verifications || [];


		const verifiedCount =
			getVerificationCount(
				issue
			);


		const totalCount =
			verifications.length ||
			REQUIRED_VERIFICATIONS;


		const percentage =
			Math.min(
				100,
				(verifiedCount / totalCount) * 100
			);


		/* ---------------------------------------------
		   COUNT
		--------------------------------------------- */

		if (verificationCount) {

			verificationCount.textContent =
				`${verifiedCount} / ${totalCount}`;

		}


		/* ---------------------------------------------
		   PROGRESS BAR
		--------------------------------------------- */

		if (verificationProgressBar) {

			verificationProgressBar.style.width =
				`${percentage}%`;

		}


		/* ---------------------------------------------
		   RESET CLASSES
		--------------------------------------------- */

		verificationSection.classList.remove(
			"waiting",
			"verified"
		);


		/* ---------------------------------------------
		   CITIZEN LIST
		--------------------------------------------- */

		renderCitizenVerificationList(
			verifications
		);


		/* ---------------------------------------------
		   VERIFIED
		--------------------------------------------- */

		if (
			verifiedCount >=
			REQUIRED_VERIFICATIONS
		) {

			verificationSection.classList.add(
				"verified"
			);


			if (verificationCount) {

				verificationCount.classList.add(
					"complete"
				);

			}


			if (verificationMessage) {

				verificationMessage.textContent =
					"All required citizens have verified this issue. The complaint can now be closed.";

			}


			if (verificationComplete) {

				verificationComplete.style.display =
					"flex";

			}


			if (closeComplaintBtn) {

				closeComplaintBtn.style.display =
					"flex";

			}

		}

		/* ---------------------------------------------
		   NOT VERIFIED YET
		--------------------------------------------- */

		else {

			verificationSection.classList.add(
				"waiting"
			);


			if (verificationCount) {

				verificationCount.classList.remove(
					"complete"
				);

			}


			if (verificationMessage) {

				if (issue.status === "resolved") {

					verificationMessage.textContent =
						`Waiting for citizen verification. ${verifiedCount} of ${REQUIRED_VERIFICATIONS} citizens have verified this issue.`;

				} else {

					verificationMessage.textContent =
						"Citizen verification will begin after the issue is resolved.";

				}

			}


			if (verificationComplete) {

				verificationComplete.style.display =
					"none";

			}


			if (closeComplaintBtn) {

				closeComplaintBtn.style.display =
					"none";

			}

		}

	}


	/* =====================================================
	   RENDER CITIZEN VERIFICATION LIST
	===================================================== */

	function renderCitizenVerificationList(
		verifications
	) {

		if (!citizenVerificationList) {
			return;
		}


		citizenVerificationList.innerHTML =
			"";


		verifications.forEach(
			citizen => {

				const item =
					document.createElement(
						"div"
					);


				item.className =
					"citizen-verification-item";


				const citizenInfo =
					document.createElement(
						"div"
					);


				citizenInfo.className =
					"citizen-info";


				const avatar =
					document.createElement(
						"div"
					);


				avatar.className =
					"citizen-avatar";


				avatar.textContent =
					"👤";


				const info =
					document.createElement(
						"div"
					);


				const userId =
					document.createElement(
						"strong"
					);


				userId.textContent =
					citizen.userId;


				const role =
					document.createElement(
						"span"
					);


				role.textContent =
					citizen.role;


				info.appendChild(
					userId
				);


				info.appendChild(
					role
				);


				citizenInfo.appendChild(
					avatar
				);


				citizenInfo.appendChild(
					info
				);


				const status =
					document.createElement(
						"span"
					);


				status.className =
					"verification-status " +
					citizen.status;


				if (
					citizen.status ===
					"verified"
				) {

					status.textContent =
						"✓ Verified";

				}

				else if (
					citizen.status ===
					"rejected"
				) {

					status.textContent =
						"Rejected";

				}

				else {

					status.textContent =
						"Waiting";

				}


				item.appendChild(
					citizenInfo
				);


				item.appendChild(
					status
				);


				citizenVerificationList.appendChild(
					item
				);

			}
		);

	}


	/* =====================================================
	   CLOSE ISSUE PANEL
	===================================================== */

	function closeIssueDetailsPanel() {

		if (issuePanel) {

			issuePanel.classList.remove(
				"active"
			);

		}


		if (issuePanelOverlay) {

			issuePanelOverlay.classList.remove(
				"active"
			);

		}


		document.body.style.overflow =
			"";


		currentIssueId =
			null;

	}


	/* =====================================================
	   CLOSE BUTTON
	===================================================== */

	if (closeIssuePanel) {

		closeIssuePanel.addEventListener(
			"click",
			closeIssueDetailsPanel
		);

	}


	/* =====================================================
	   OVERLAY CLICK
	===================================================== */

	if (issuePanelOverlay) {

		issuePanelOverlay.addEventListener(
			"click",
			closeIssueDetailsPanel
		);

	}


	/* =====================================================
	   ESCAPE KEY
	===================================================== */

	document.addEventListener(
		"keydown",
		event => {

			if (
				event.key === "Escape" &&
				issuePanel &&
				issuePanel.classList.contains(
					"active"
				)
			) {

				closeIssueDetailsPanel();

			}

		}
	);


	/* =====================================================
	   VIEW BUTTONS
	===================================================== */

	function attachViewButtons() {

		const buttons =
			document.querySelectorAll(
				".view-issue-btn"
			);


		buttons.forEach(
			button => {

				button.addEventListener(
					"click",
					() => {

						const issueId =
							button.dataset.issueId;


						openIssuePanel(
							issueId
						);

					}
				);

			}
		);

	}


	attachViewButtons();

	/* =====================================================
   CUSTOM WORKFLOW ALERT
===================================================== */

	function showWorkflowAlert(
		title,
		message,
		icon = "✓"
	) {

		if (!workflowAlertOverlay) {
			return;
		}


		if (workflowAlertTitle) {

			workflowAlertTitle.textContent =
				title;

		}


		if (workflowAlertMessage) {

			workflowAlertMessage.textContent =
				message;

		}


		if (workflowAlertIcon) {

			workflowAlertIcon.textContent =
				icon;

		}


		workflowAlertOverlay.classList.add(
			"active"
		);

	}


	/* =====================================================
	   CLOSE WORKFLOW ALERT
	===================================================== */

	function closeWorkflowAlert() {

		if (workflowAlertOverlay) {

			workflowAlertOverlay.classList.remove(
				"active"
			);

		}

	}


	if (workflowAlertClose) {

		workflowAlertClose.addEventListener(
			"click",
			closeWorkflowAlert
		);

	}


	if (workflowAlertOverlay) {

		workflowAlertOverlay.addEventListener(
			"click",
			event => {

				if (
					event.target ===
					workflowAlertOverlay
				) {

					closeWorkflowAlert();

				}

			}
		);

	}


	/* =====================================================
	   STATUS UPDATE
	===================================================== */

	function updateIssueStatus(
		issueId,
		newStatus
	) {

		const issue =
			issueData[issueId];


		if (!issue) {
			return;
		}


		issue.status =
			newStatus;


		updatePanelStatus(
			newStatus
		);


		updateTableStatus(
			issueId,
			newStatus
		);


		updateVerificationUI(
			issue
		);

	}


	/* =====================================================
	   UPDATE TABLE STATUS
	===================================================== */

	function updateTableStatus(
		issueId,
		newStatus
	) {

		const viewButton =
			document.querySelector(
				`.view-issue-btn[data-issue-id="${issueId}"]`
			);


		if (!viewButton) {
			return;
		}


		const row =
			viewButton.closest("tr");


		if (!row) {
			return;
		}


		row.dataset.status =
			newStatus;


		const badge =
			row.querySelector(
				".status"
			);


		if (badge) {

			badge.textContent =
				statusNames[newStatus] ||
				newStatus;


			badge.className =
				"status " +
				newStatus;

		}

	}


	/* =====================================================
	   STATUS DROPDOWN CHANGE
	===================================================== */

	if (panelStatusSelect) {

		panelStatusSelect.addEventListener(
			"change",
			() => {

				if (!currentIssueId) {
					return;
				}


				const issue =
					issueData[currentIssueId];


				if (!issue) {
					return;
				}


				const newStatus =
					panelStatusSelect.value;


				/*
				 * Admin should not manually
				 * mark a resolved issue as closed
				 * without verification.
				 */

				if (
					newStatus === "closed" &&
					getVerificationCount(issue) <
					REQUIRED_VERIFICATIONS
				) {

					panelStatusSelect.value =
						issue.status;


					showWorkflowAlert(
						"Verification Required",
						"This complaint cannot be closed yet. Please wait until the required citizens verify the resolution.",
						"!"
					);


					return;

				}


				/*
				 * Verified status requires
				 * all required citizens.
				 */

				if (
					newStatus === "verified" &&
					getVerificationCount(issue) <
					REQUIRED_VERIFICATIONS
				) {

					panelStatusSelect.value =
						issue.status;


					showWorkflowAlert(
						"Verification Pending",
						"The issue can only become Verified after all required citizens confirm that the issue has been resolved.",
						"!"
					);


					return;

				}


				updateIssueStatus(
					currentIssueId,
					newStatus
				);

			}
		);

	}


	/* =====================================================
	   ASSIGN ISSUE
	===================================================== */

	if (assignIssueBtn) {

		assignIssueBtn.addEventListener(
			"click",
			() => {

				if (!currentIssueId) {
					return;
				}


				const issue =
					issueData[currentIssueId];


				if (!issue) {
					return;
				}


				const newTeam =
					prompt(
						"Enter the team/person to assign this issue:",
						issue.assigned
					);


				if (
					newTeam === null ||
					newTeam.trim() === ""
				) {

					return;

				}


				issue.assigned =
					newTeam.trim();


				if (panelAssigned) {

					panelAssigned.textContent =
						issue.assigned;

				}


				showWorkflowAlert(
					"Issue Assigned",
					`#${issue.id} has been assigned to ${issue.assigned}.`,
					"✓"
				);

			}
		);

	}


	/* =====================================================
	   REJECT ISSUE
	===================================================== */

	if (rejectIssueBtn) {

		rejectIssueBtn.addEventListener(
			"click",
			() => {

				if (!currentIssueId) {
					return;
				}


				const issue =
					issueData[currentIssueId];


				if (!issue) {
					return;
				}


				const confirmed =
					confirm(
						`Are you sure you want to reject #${issue.id}?`
					);


				if (!confirmed) {
					return;
				}


				updateIssueStatus(
					issue.id,
					"rejected"
				);


				showWorkflowAlert(
					"Issue Rejected",
					`#${issue.id} has been rejected and will not proceed through the resolution workflow.`,
					"!"
				);

			}
		);

	}

	/* =====================================================
   RESOLVE ISSUE
===================================================== */

	if (resolveIssueBtn) {

		resolveIssueBtn.addEventListener(
			"click",
			() => {

				if (!currentIssueId) {
					return;
				}


				const issue =
					issueData[currentIssueId];


				if (!issue) {
					return;
				}


				/*
				 * Already resolved
				 */

				if (
					issue.status ===
					"resolved"
				) {

					showWorkflowAlert(
						"Already Resolved",
						"This issue has already been marked as resolved and is currently waiting for citizen verification.",
						"!"
					);


					return;

				}


				/*
				 * Already verified
				 */

				if (
					issue.status ===
					"verified"
				) {

					showWorkflowAlert(
						"Issue Already Verified",
						"Citizens have already verified this issue. You can now close the complaint.",
						"✓"
					);


					return;

				}


				/*
				 * Closed issue
				 */

				if (
					issue.status ===
					"closed"
				) {

					showWorkflowAlert(
						"Complaint Closed",
						"This complaint has already been closed.",
						"✓"
					);


					return;

				}


				const confirmed =
					confirm(
						`Mark #${issue.id} as Resolved?`
					);


				if (!confirmed) {
					return;
				}


				/*
				 * Set status to resolved
				 */

				issue.status =
					"resolved";


				updateIssueStatus(
					issue.id,
					"resolved"
				);


				/*
				 * Reset verification state
				 * if required.
				 */

				if (
					Array.isArray(
						issue.verifications
					)
				) {

					issue.verifications.forEach(
						citizen => {

							if (
								citizen.status !==
								"verified"
							) {

								citizen.status =
									"waiting";

							}

						}
					);

				}


				updateVerificationUI(
					issue
				);


				/*
				 * Important alert:
				 * Admin must now wait for
				 * citizen responses.
				 */

				showWorkflowAlert(
					"Issue Resolved",
					`#${issue.id} has been marked as Resolved. The work is complete from the authority side. Now we will wait for citizen verification before closing the complaint.`,
					"✓"
				);

			}
		);

	}


	/* =====================================================
	   CLOSE COMPLAINT
	===================================================== */

	if (closeComplaintBtn) {

		closeComplaintBtn.addEventListener(
			"click",
			() => {

				if (!currentIssueId) {
					return;
				}


				const issue =
					issueData[currentIssueId];


				if (!issue) {
					return;
				}


				const verifiedCount =
					getVerificationCount(
						issue
					);


				/*
				 * Safety check
				 */

				if (
					verifiedCount <
					REQUIRED_VERIFICATIONS
				) {

					showWorkflowAlert(
						"Verification Required",
						`Only ${verifiedCount} of ${REQUIRED_VERIFICATIONS} required citizens have verified this issue. The complaint cannot be closed yet.`,
						"!"
					);


					return;

				}


				/*
				 * First move to Verified
				 */

				if (
					issue.status !==
					"verified"
				) {

					issue.status =
						"verified";


					updateIssueStatus(
						issue.id,
						"verified"
					);

				}


				/*
				 * Ask confirmation
				 */

				const confirmed =
					confirm(
						`All required citizens have verified #${issue.id}. Close this complaint now?`
					);


				if (!confirmed) {
					return;
				}


				/*
				 * Finally close complaint
				 */

				issue.status =
					"closed";


				updateIssueStatus(
					issue.id,
					"closed"
				);


				/*
				 * Hide close button
				 */

				closeComplaintBtn.style.display =
					"none";


				showWorkflowAlert(
					"Complaint Closed",
					`#${issue.id} has been successfully verified by citizens and the complaint is now officially closed.`,
					"✓"
				);

			}
		);

	}


	/* =====================================================
	   SIMULATE CITIZEN VERIFICATION
	   
	   DEMO ONLY
	   
	   This function lets you test the workflow
	   without a backend.
	===================================================== */

	function simulateCitizenVerification(
		issueId
	) {

		const issue =
			issueData[issueId];


		if (!issue) {
			return;
		}


		/*
		 * Verification should happen only
		 * after resolution.
		 */

		if (
			issue.status !==
			"resolved"
		) {

			showWorkflowAlert(
				"Verification Not Available",
				"Citizen verification will start only after the issue has been marked as Resolved.",
				"!"
			);


			return;

		}


		const waitingCitizen =
			issue.verifications.find(
				citizen =>
					citizen.status ===
					"waiting"
			);


		if (!waitingCitizen) {

			updateVerificationUI(
				issue
			);


			return;

		}


		waitingCitizen.status =
			"verified";


		const verifiedCount =
			getVerificationCount(
				issue
			);


		updateVerificationUI(
			issue
		);


		/*
		 * If all citizens verified
		 */

		if (
			verifiedCount >=
			REQUIRED_VERIFICATIONS
		) {

			issue.status =
				"verified";


			updateIssueStatus(
				issue.id,
				"verified"
			);


			showWorkflowAlert(
				"Issue Verified",
				`All ${REQUIRED_VERIFICATIONS} required citizens have confirmed that #${issue.id} has been resolved. The complaint is now ready to be closed.`,
				"✓"
			);

		}

	}

	/* =====================================================
   DEMO VERIFICATION TEST
   
   IMPORTANT:
   This is only for frontend testing.
   
   Every 8 seconds it verifies one citizen
   for a currently resolved issue.
   
   Remove this block when backend is connected.
===================================================== */

	/*
	setInterval(() => {

		const resolvedIssue =
			Object.values(issueData).find(
				issue =>
					issue.status ===
					"resolved"
			);


		if (resolvedIssue) {

			simulateCitizenVerification(
				resolvedIssue.id
			);

		}

	}, 8000);
	*/


	/* =====================================================
	   SEARCH
	===================================================== */

	function filterIssues() {

		const searchValue =
			issueSearch
				? issueSearch.value
					.trim()
					.toLowerCase()
				: "";


		const selectedStatus =
			statusFilter
				? statusFilter.value
				: "all";


		const selectedPriority =
			priorityFilter
				? priorityFilter.value
				: "all";


		const selectedCategory =
			categoryFilter
				? categoryFilter.value
				: "all";


		const rows =
			tableBody
				? tableBody.querySelectorAll(
					"tr"
				)
				: [];


		rows.forEach(
			row => {

				const rowText =
					row.textContent
						.toLowerCase();


				const rowStatus =
					row.dataset.status;


				const rowPriority =
					row.dataset.priority;


				const rowCategory =
					row.dataset.category;


				const matchesSearch =
					searchValue === "" ||
					rowText.includes(
						searchValue
					);


				const matchesStatus =
					selectedStatus === "all" ||
					rowStatus ===
					selectedStatus;


				const matchesPriority =
					selectedPriority === "all" ||
					rowPriority ===
					selectedPriority;


				const matchesCategory =
					selectedCategory === "all" ||
					rowCategory ===
					selectedCategory;


				const shouldShow =
					matchesSearch &&
					matchesStatus &&
					matchesPriority &&
					matchesCategory;


				row.style.display =
					shouldShow
						? ""
						: "none";

			}
		);


		updateVisibleIssueCount();

	}


	/* =====================================================
	   SEARCH EVENTS
	===================================================== */

	if (issueSearch) {

		issueSearch.addEventListener(
			"input",
			filterIssues
		);

	}


	if (searchButton) {

		searchButton.addEventListener(
			"click",
			filterIssues
		);

	}


	/* =====================================================
	   FILTER EVENTS
	===================================================== */

	if (statusFilter) {

		statusFilter.addEventListener(
			"change",
			filterIssues
		);

	}


	if (priorityFilter) {

		priorityFilter.addEventListener(
			"change",
			filterIssues
		);

	}


	if (categoryFilter) {

		categoryFilter.addEventListener(
			"change",
			filterIssues
		);

	}


	if (dateFilter) {

		dateFilter.addEventListener(
			"change",
			filterIssues
		);

	}


	/* =====================================================
	   VISIBLE ISSUE COUNT
	===================================================== */

	function updateVisibleIssueCount() {

		if (!tableBody) {
			return;
		}


		const rows =
			Array.from(
				tableBody.querySelectorAll(
					"tr"
				)
			);


		const visibleRows =
			rows.filter(
				row =>
					row.style.display !==
					"none"
			);


		const issueCount =
			document.querySelector(
				".issue-count"
			);


		if (issueCount) {

			issueCount.textContent =
				`Showing ${visibleRows.length} of ${rows.length} visible issues`;

		}

	}


	/* =====================================================
	   PAGINATION
	===================================================== */

	const paginationButtons =
		document.querySelectorAll(
			".page-btn"
		);


	paginationButtons.forEach(
		button => {

			button.addEventListener(
				"click",
				() => {

					if (
						button.classList.contains(
							"prev"
						) ||
						button.classList.contains(
							"next"
						)
					) {

						return;

					}


					paginationButtons.forEach(
						page => {

							page.classList.remove(
								"active"
							);

						}
					);


					button.classList.add(
						"active"
					);

				}
			);

		}
	);


	/* =====================================================
	   NOTIFICATION
	===================================================== */

	const notificationButton =
		document.querySelector(
			".notification-btn"
		);


	if (notificationButton) {

		notificationButton.addEventListener(
			"click",
			() => {

				showWorkflowAlert(
					"Notifications",
					"You have 3 new issue-related notifications.",
					"🔔"
				);

			}
		);

	}


	/* =====================================================
	   ADMIN PROFILE
	===================================================== */

	const profileDropdown =
		document.querySelector(
			".profile-dropdown"
		);


	if (profileDropdown) {

		profileDropdown.addEventListener(
			"click",
			() => {

				showWorkflowAlert(
					"Admin Profile",
					"Admin profile menu will be available here.",
					"👤"
				);

			}
		);

	}


	/* =====================================================
	   DEFAULT FILTER VALUES
	===================================================== */

	if (issueSearch) {

		issueSearch.value =
			"";

	}


	if (statusFilter) {

		statusFilter.value =
			"all";

	}


	if (priorityFilter) {

		priorityFilter.value =
			"all";

	}


	if (categoryFilter) {

		categoryFilter.value =
			"all";

	}


	if (dateFilter) {

		dateFilter.value =
			"month";

	}


	/* =====================================================
	   LIVE DATABASE & COMPLAINT STORE SYNCHRONIZATION
	===================================================== */

	function loadLiveComplaintsIntoAdminQueue() {
		let liveComplaints = [];

		if (window.CivicBuzzAPI?.store?.getAll) {
			liveComplaints = window.CivicBuzzAPI.store.getAll();
		} else if (window.ComplaintStore?.getAll) {
			liveComplaints = window.ComplaintStore.getAll();
		} else {
			try {
				liveComplaints = JSON.parse(localStorage.getItem("civicbuzz_complaints") || localStorage.getItem("civicbuzz_registered_complaints") || "[]");
			} catch (_) {}
		}

		if (!Array.isArray(liveComplaints) || liveComplaints.length === 0 || !tableBody) return;

		const existingRowIds = new Set();
		tableBody.querySelectorAll("tr").forEach(tr => {
			const strong = tr.querySelector("td strong");
			if (strong) {
				existingRowIds.add(strong.textContent.replace("#", "").trim());
			}
		});

		liveComplaints.forEach(c => {
			const cid = c.complaint_id;
			if (!cid) return;

			const catKey = (c.category || "road").toLowerCase().replace(/_/g, "");
			const rawPriority = (c.priority_level || c.severity || "medium").toLowerCase();
			const statusKey = (c.status || "pending").toLowerCase() === "submitted" ? "pending" : (c.status || "pending").toLowerCase();
			const categoryIcon = catKey.includes("garbage") || catKey.includes("sanitation") ? "🗑️" : catKey.includes("light") ? "💡" : catKey.includes("water") ? "🚰" : catKey.includes("park") ? "🌳" : "🛣️";
			const dateStr = new Date(c.created_at || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

			// Populate issueData
			if (!issueData[cid]) {
				issueData[cid] = {
					id: cid,
					title: c.title,
					userId: c.is_anonymous ? "ANONYMOUS-CITIZEN" : (c.reporter_name || "USR-CITIZEN"),
					date: dateStr,
					location: c.ward_label || c.ward || c.address || "Bhubaneswar",
					category: catKey.includes("garbage") ? "Garbage" : catKey.includes("light") ? "Lighting" : catKey.includes("water") ? "Water" : catKey.includes("park") ? "Parks" : "Road",
					priority: rawPriority,
					status: statusKey,
					assigned: c.department_name || "Roads & Works Department",
					description: c.description,
					image: c.image_url || "",
					urgency_score: c.urgency_score || 85,
					verifications: [
						{ userId: "USR-REPORTER", role: "Reporter", status: c.status === "RESOLVED" ? "verified" : "waiting" },
						{ userId: "USR-INSPECTOR", role: "Ward Engineer", status: c.status === "RESOLVED" ? "verified" : "waiting" },
						{ userId: "USR-CITIZEN-2", role: "Nearby Citizen", status: "waiting" }
					]
				};
			}

			// Prepend row to table if not existing
			if (!existingRowIds.has(cid)) {
				const tr = document.createElement("tr");
				tr.dataset.status = statusKey;
				tr.dataset.priority = rawPriority;
				tr.dataset.category = catKey.includes("garbage") ? "garbage" : catKey.includes("light") ? "lighting" : catKey.includes("water") ? "water" : "road";

				tr.innerHTML = `
					<td><strong>#${cid}</strong></td>
					<td>${c.title}</td>
					<td>${c.is_anonymous ? '<span style="color:#64748b; font-style:italic;">Protected (Anonymous)</span>' : 'USR-CITIZEN'}</td>
					<td><span class="category">${categoryIcon} ${c.category || 'Road'}</span></td>
					<td><span class="priority ${rawPriority}">${rawPriority.charAt(0).toUpperCase() + rawPriority.slice(1)}</span></td>
					<td>${dateStr}</td>
					<td><span class="status ${statusKey}">${statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}</span></td>
					<td><button class="view-issue-btn" type="button" data-issue-id="${cid}">👁</button></td>
				`;
				tableBody.insertBefore(tr, tableBody.firstChild);
				existingRowIds.add(cid);
			}
		});

		attachViewButtons();
		filterIssues();
	}

	loadLiveComplaintsIntoAdminQueue();

	window.addEventListener("civicbuzz_data_updated", () => {
		loadLiveComplaintsIntoAdminQueue();
	});

	window.addEventListener("storage", (e) => {
		if (e.key === "civicbuzz_complaints" || e.key === "civicbuzz_registered_complaints") {
			loadLiveComplaintsIntoAdminQueue();
		}
	});

	/* =====================================================
	   INITIAL FILTER
	===================================================== */

	filterIssues();

	console.log(
		"CivicBuzz Track Issues loaded successfully."
	);

});
