import {
	PUBLIC_IDENTITY_POOL_ID,
	PUBLIC_POOL_ID,
	PUBLIC_S3_BUCKET,
	PUBLIC_S3_BUCKET_REGION
} from '$env/static/public';

const awsmobile = {
	aws_project_region: 'us-east-1',
	aws_cognito_identity_pool_id: PUBLIC_IDENTITY_POOL_ID,
	aws_cognito_region: 'us-east-1',
	aws_user_pools_id: PUBLIC_POOL_ID,
	aws_user_pools_web_client_id: '49gekp3gj30s4spea7ffkb2vg5',
	oauth: {},
	aws_cognito_username_attributes: ['EMAIL'],
	aws_cognito_social_providers: [],
	aws_cognito_signup_attributes: ['EMAIL'],
	aws_cognito_mfa_configuration: 'OFF',
	aws_cognito_mfa_types: ['SMS'],
	aws_cognito_password_protection_settings: {
		passwordPolicyMinLength: 8,
		passwordPolicyCharacters: []
	},
	aws_cognito_verification_mechanisms: ['EMAIL'],
	aws_user_files_s3_bucket: PUBLIC_S3_BUCKET, // Add this key
	aws_user_files_s3_bucket_region: PUBLIC_S3_BUCKET_REGION // Add this key
};

export default awsmobile;
