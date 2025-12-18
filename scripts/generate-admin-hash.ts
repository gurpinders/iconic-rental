import bcrypt from 'bcryptjs';

async function main() {
  const password = 'Iconic1234'; // Change this to your desired password
  
  console.log('Generating password hash...\n');
  
  const hash = await bcrypt.hash(password, 10);
  
  console.log('✅ Password hash generated!\n');
  console.log('Copy this hash to your .env.local file:\n');
  console.log(hash);
  console.log('\nYour admin credentials will be:');
  console.log('Email: psandhu0124@gmail.com');
  console.log(`Password: ${password}`);
  console.log('\n⚠️  Remember to keep your .env.local file secure!');
}

main();