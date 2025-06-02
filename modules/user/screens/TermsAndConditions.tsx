import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { H4Bold, Body1Title2Medium } from '@/components';
import { scale } from '@/theme/responsive';

const TermsAndConditions: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <H4Bold style={styles.title}>Terms and Conditions</H4Bold>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          (Compliant with Indian Laws and Global Best Practices)
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionText}>
          Effective Date: June 1, 2025{'\n'}
          Last Updated: June 1, 2025
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          Welcome to Madrasa App! These Terms and Conditions ("Terms") govern your use of the Madrasa App, a platform offering Islamic education (Deen) and modern skill-based courses (Duniya). By accessing, registering, or using Madrasa App, you agree to comply with these Terms. If you do not agree, please refrain from using our services.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          1. Definitions
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          "Madrasa App" – A mobile application providing online education in Islamic Studies and modern skill-based courses.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          "We," "Us," "Our" – Refers to Madrasa App and its parent company Madrasa Education Pvt. Ltd.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          "User," "You" – Any individual registering or using Madrasa App.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          "Tutor" – Any educator, scholar, or professional providing courses on the app.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          "Services" – Includes educational content, live classes, recorded courses, community features, and all other offerings on the app.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          2. Account Registration
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          a) Eligibility: You must be at least 13 years old to use Madrasa App. Users under 18 must have parental consent.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          b) Account Information: You must provide accurate, complete, and current information during registration and keep it updated.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          c) Account Security: You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          3. User Conduct
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          You agree not to:
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          a) Violate any applicable laws or regulations.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          b) Infringe on intellectual property rights.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          c) Share harmful, offensive, or inappropriate content.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          d) Impersonate others or misrepresent your affiliation.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          e) Attempt to access restricted areas of the app.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          4. Intellectual Property
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          a) Our Content: All content on Madrasa App, including courses, videos, text, graphics, and logos, is owned by us or our licensors and protected by intellectual property laws.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          b) Limited License: We grant you a limited, non-exclusive, non-transferable license to access and use our content for personal, non-commercial purposes.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          c) User Content: By submitting content to Madrasa App, you grant us a worldwide, royalty-free license to use, modify, and display that content.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          5. Payments and Subscriptions
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          a) Free and Paid Content: Madrasa App offers both free and premium content. Access to premium content requires payment.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          b) Subscription Terms: Subscription fees are charged at the beginning of each billing period. Subscriptions automatically renew unless canceled.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          c) Refunds: Refund policies vary by course or subscription type and are specified at the time of purchase.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          6. Termination
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          We reserve the right to suspend or terminate your account for violations of these Terms or for any other reason at our discretion.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          7. Disclaimer of Warranties
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          Madrasa App is provided "as is" without warranties of any kind, either express or implied.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          8. Limitation of Liability
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          9. Governing Law
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          These Terms are governed by the laws of India, without regard to its conflict of law principles.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          10. Changes to Terms
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          We may modify these Terms at any time. Continued use of Madrasa App after changes constitutes acceptance of the modified Terms.
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.sectionTitle}>
          11. Contact Us
        </Body1Title2Medium>
        
        <Body1Title2Medium color="sub-heading" style={styles.text}>
          If you have questions about these Terms, please contact us at legal@madrasa-app.com.
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

export default TermsAndConditions;
