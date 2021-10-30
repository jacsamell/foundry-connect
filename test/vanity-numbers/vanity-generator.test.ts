import { generateVanityNumbers } from '../../lib/vanity-numbers/vanity-generator';
import { words } from '../../lib/vanity-numbers/words';

test('blah', () => {
    // Some numbers have limited options (e.g 01100111000) so we may not always get the desired count
    const desiredCount = 5;

    // last 6 are the ones to make vanity
    const phoneNumber = '+447776482520';

    console.log(words.length);

    for (let i = 0; i < 10; i++) {
        // const lastDigits = Math.round(Math.random() * 1000000).toString().padStart(6, '0');
        // const lastDigits = '736753';
        const vanityNumbers = generateVanityNumbers(phoneNumber);

        console.log(phoneNumber + ' : ' + vanityNumbers)
    }

    // expect(vanityNumbers).toEqual(['01234567890'])
})
