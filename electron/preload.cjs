const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  // Database & CRM queries
  getDashboardMetrics: () => ipcRenderer.invoke('db:getDashboardMetrics'),
  getCompanies: (filters) => ipcRenderer.invoke('db:getCompanies', filters),
  getCompanyDetails: (id) => ipcRenderer.invoke('db:getCompanyDetails', id),
  updateCompanyPriority: (id, priority) => ipcRenderer.invoke('db:updateCompanyPriority', id, priority),
  getOpportunities: (filters) => ipcRenderer.invoke('db:getOpportunities', filters),
  getOpportunityDetails: (id) => ipcRenderer.invoke('db:getOpportunityDetails', id),
  
  getApplications: (filters) => ipcRenderer.invoke('db:getApplications', filters),
  updateApplicationStatus: (id, status) => ipcRenderer.invoke('db:updateApplicationStatus', id, status),
  createApplication: (data) => ipcRenderer.invoke('db:createApplication', data),
  deleteApplication: (id) => ipcRenderer.invoke('db:deleteApplication', id),
  
  getUserProfile: () => ipcRenderer.invoke('db:getUserProfile'),
  updateUserProfile: (profile) => ipcRenderer.invoke('db:updateUserProfile', profile),
  getSkills: () => ipcRenderer.invoke('db:getSkills'),
  addSkill: (skill) => ipcRenderer.invoke('db:addSkill', skill),
  deleteSkill: (id) => ipcRenderer.invoke('db:deleteSkill', id),

  getDrafts: (status) => ipcRenderer.invoke('db:getDrafts', status),
  getDraftById: (id) => ipcRenderer.invoke('db:getDraftById', id),
  saveDraft: (draft) => ipcRenderer.invoke('db:saveDraft', draft),
  deleteDraft: (id) => ipcRenderer.invoke('db:deleteDraft', id),

  getFollowUps: () => ipcRenderer.invoke('db:getFollowUps'),
  updateFollowUpStatus: (id, status) => ipcRenderer.invoke('db:updateFollowUpStatus', id, status),

  getSettings: () => ipcRenderer.invoke('db:getSettings'),
  updateSetting: (key, value) => ipcRenderer.invoke('db:updateSetting', key, value),
  getAuditLogs: () => ipcRenderer.invoke('db:getAuditLogs'),

  // Search Engine
  runSearch: (params) => ipcRenderer.invoke('search:run', params),
  getLastSearchRun: () => ipcRenderer.invoke('search:getLastRun'),
  onAutoUpdateCompleted: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('search:autoUpdateCompleted', handler);
    return () => ipcRenderer.removeListener('search:autoUpdateCompleted', handler);
  },

  // AI & Generator
  generateEmail: (params) => ipcRenderer.invoke('ai:generateEmail', params),

  // Email Actions & Safety
  sendEmail: (draftId) => ipcRenderer.invoke('email:sendEmail', draftId),
  batchSend: (draftIds) => ipcRenderer.invoke('email:batchSend', draftIds),
  exportEml: (draftId) => ipcRenderer.invoke('email:exportEml', draftId),
  testEmailConnection: () => ipcRenderer.invoke('email:testConnection'),
  setGlobalPause: (paused) => ipcRenderer.invoke('email:setGlobalPause', paused),
  getGlobalPause: () => ipcRenderer.invoke('email:getGlobalPause'),

  // File Operations & CV Management
  uploadCv: (data) => ipcRenderer.invoke('files:uploadCv', data),
  getDocuments: () => ipcRenderer.invoke('files:getDocuments'),
  exportCsv: (table) => ipcRenderer.invoke('files:exportCsv', table),
  backupDatabase: () => ipcRenderer.invoke('files:backupDatabase'),
  restoreDatabase: () => ipcRenderer.invoke('files:restoreDatabase'),

  // Shell & Window
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
  windowAction: (action) => ipcRenderer.invoke('window:action', action)
});
