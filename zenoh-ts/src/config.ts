//
// Copyright (c) 2024 ZettaScale Technology
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0, or the Apache License, Version 2.0
// which is available at https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
//
// Contributors:
//   ZettaScale Zenoh Team, <zenoh@zettascale.tech>
//

//  ██████  ██████  ███    ██ ███████ ██  ██████
// ██      ██    ██ ████   ██ ██      ██ ██
// ██      ██    ██ ██ ██  ██ █████   ██ ██   ███
// ██      ██    ██ ██  ██ ██ ██      ██ ██    ██
//  ██████  ██████  ██   ████ ██      ██  ██████

/**
  * The configuration for a Zenoh Session.
  */
export class Config {
  locator: string;

  /**
   * Construct a new config, containing a locator
   * @param {string} locator - A string that respects the Locator canon form: `<proto>/<address>[?<metadata>]`
   * i.e. `ws/127.0.0.1:10000`
   * @returns {Config} configuration instance
   */
  constructor(locator: string) {
    this.locator = locator;
  }
}