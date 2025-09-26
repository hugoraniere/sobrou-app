import React from 'react';
import StatementImportSection from '@/components/landing/StatementImportSection';

interface InlineStatementImportSectionProps {
  onConfigChange: () => void;
}

const InlineStatementImportSection: React.FC<InlineStatementImportSectionProps> = ({ onConfigChange }) => {
  return (
    <div id="section-statement">
      <StatementImportSection />
    </div>
  );
};

export default InlineStatementImportSection;