/**
 * @jest-environment jsdom
 */

import { ToggleLogin } from '../scripts/utils/toggleLoginForm.js';

describe('ToggleLogin', () => {
  beforeEach(() => {
    // Set up a mock DOM for each test
    document.body.innerHTML = `
      <div id="loginFormVolunteer" class="d-none">Volunteer Form</div>
      <div id="loginFormAdopters">Adopter Form</div>
      <div id="loginFormStaff" class="d-none">Staff Form</div>

      <button id="loginBtnVolunteer"></button>
      <button id="loginBtnAdopters"></button>
      <button id="loginBtnStaff"></button>
    `;
  });

  test('should show the correct form based on URL parameter', () => {
    // Mock the URL
    Object.defineProperty(window, 'location', {
      value: {
        search: '?form=volunteer',
      },
      writable: true,
    });

    new ToggleLogin();

    expect(document.getElementById('loginFormVolunteer').classList.contains('d-none')).toBe(false);
    expect(document.getElementById('loginFormAdopters').classList.contains('d-none')).toBe(true);
    expect(document.getElementById('loginFormStaff').classList.contains('d-none')).toBe(true);
  });

  test('should switch to the correct form when a button is clicked', () => {
    const loginToggler = new ToggleLogin();
    loginToggler.ToggleLoginButton();

    const staffButton = document.getElementById('loginBtnStaff');
    staffButton.click();

    expect(document.getElementById('loginFormStaff').classList.contains('d-none')).toBe(false);
    expect(document.getElementById('loginFormAdopters').classList.contains('d-none')).toBe(true);
    expect(document.getElementById('loginFormVolunteer').classList.contains('d-none')).toBe(true);
  });
});