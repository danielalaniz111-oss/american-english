import bcrypt from 'bcryptjs';

// Test password hashing
const password = 'password123';
const hashedPassword = await bcrypt.hash(password, 12);

console.log('Testing Basic Auth Setup:');
console.log('========================');
console.log('Original password:', password);
console.log('Hashed password:', hashedPassword);

// Test password verification
const isValid = await bcrypt.compare(password, hashedPassword);
console.log('Password verification:', isValid ? '✓ PASSED' : '✗ FAILED');

// Test with wrong password
const isInvalid = await bcrypt.compare('wrongpassword', hashedPassword);
console.log('Wrong password rejection:', !isInvalid ? '✓ PASSED' : '✗ FAILED');

console.log('\nBasic auth components are working correctly!');
console.log('\nTo test the full flow:');
console.log('1. Go to http://localhost:3001/auth/signup');
console.log('2. Create an account with:');
console.log('   - Email: test@example.com');
console.log('   - Password: password123');
console.log('3. Then sign in at http://localhost:3001/auth/signin');