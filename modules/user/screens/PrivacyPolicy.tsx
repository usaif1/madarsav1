import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { H4Bold, Body1Title2Medium } from '@/components';
import { scale } from '@/theme/responsive';

const PrivacyPolicy: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <H4Bold style={styles.title}>Privacy policy</H4Bold>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          (As per Indian IT Laws, 2000 & Data Protection Frameworks)
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionText}>
          Effective Date: June 1, 2025{'\n'}
          Last Updated: June 1, 2025
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          1. Introduction
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          Madrasa App is an educational platform that enables users to learn Islamic studies (Deen) and modern skills (Duniya). To provide a seamless experience, we collect and process certain personal data.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          This Privacy Policy explains how Madrasa App collects, stores, processes, and shares user data in compliance with Indian laws:
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          The Information Technology (IT) Act, 2000 – Governs electronic data, cybersecurity, and online privacy.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 – Regulates sensitive personal data.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          The Personal Data Protection Bill, 2019 (Proposed) – Future data protection law for India.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          Indian Contract Act, 1872 – Covers agreements regarding user data collection and processing.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          2. Information We Collect
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          We collect the following types of information:
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          a) Account Information: Name, email address, phone number, profile picture, and authentication information when you register.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          b) Profile Information: Optional information you provide such as gender, age, education level, and areas of interest.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          c) Usage Data: Information about how you use our app, including courses accessed, progress, completion rates, and time spent.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          d) Device Information: Device type, operating system, unique device identifiers, IP address, mobile network information, and browser type.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          3. How We Use Your Information
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          We use your information to:
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          a) Provide, maintain, and improve our services.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          b) Personalize your learning experience.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          c) Process transactions and send related information.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          d) Send notifications, updates, and support messages.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          e) Analyze usage patterns to improve our platform.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          4. Data Sharing and Disclosure
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          We may share your information with:
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          a) Service Providers: Third-party companies that perform services on our behalf.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          b) Educational Partners: Institutions or educators we collaborate with to provide content.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          c) Legal Requirements: When required by law or to protect our rights.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          5. Your Rights and Choices
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          You have the right to:
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          a) Access, correct, or delete your personal information.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          b) Opt-out of marketing communications.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          c) Disable cookies through your browser settings.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          6. Data Security
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          We implement reasonable security measures to protect your data from unauthorized access, alteration, disclosure, or destruction.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          7. Contact Us
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          If you have questions about this Privacy Policy, please contact us at privacy@madrasa-app.com.
        </Body1Title2Medium>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: scale(24),
    paddingBottom: scale(40),
  },
  title: {
    fontSize: scale(24),
    marginBottom: scale(16),
  },
  sectionTitle: {
    fontWeight: '600',
    marginTop: scale(24),
    marginBottom: scale(8),
  },
  sectionText: {
    marginBottom: scale(16),
  },
  text: {
    marginBottom: scale(12),
    color: '#737373',
  },
});

export default PrivacyPolicy;
