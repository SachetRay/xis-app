import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import DataWizard from './components/DataWizard/DataWizard';
import AttributeDetails from './components/AttributeDetails/AttributeDetails';
import HomePage from './components/HomePage/HomePage';
import AnalyticsView from './components/Views/AnalyticsView/AnalyticsView';
import ProjectView from './components/Views/ProjectView/ProjectView';
import SettingsView from './components/Views/SettingsView/SettingsView';
import SearchView from './components/Views/SearchView/SearchView';
import WorkflowView from './components/Views/WorkflowView/WorkflowView';
import FeedView from './components/Views/FeedView/FeedView';
import WidgetsView from './components/Views/WidgetsView/WidgetsView';
import GoalsView from './components/Views/GoalsView/GoalsView';
import SegmentGenie from './components/SegmentGenie/SegmentGenie';
import DataGuardianView from './components/Views/DataGuardianView/DataGuardianView';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/data-wizard/*" element={<DataWizard />} />
        <Route path="/dev-toolbox" element={<ProjectView />} />
        <Route path="/data-guardian" element={<DataGuardianView />} />
        <Route path="/segment-genie" element={<SegmentGenie />} />
        <Route path="/resource-iq" element={<AnalyticsView />} />
        <Route path="/document-hub" element={<SearchView />} />
        <Route path="/ask-dgp" element={<FeedView />} />
        <Route path="/attribute/*" element={<AttributeDetails />} />
        <Route path="/settings/*" element={<SettingsView />} />
      </Routes>
    </Layout>
  );
};

export default App; 