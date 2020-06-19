import Date from './iso-date/Date';
import Time from './iso-date/Time';
import DateTime from './iso-date/DateTime';
import Timestamp from './Timestamp';
import UtcOffset from './UtcOffset';
import NonPositiveInt from './NonPositiveInt';
import PositiveInt from './PositiveInt';
import NonNegativeIntFactory from './NonNegativeInt';
import NegativeInt from './NegativeInt';
import NonPositiveFloat from './NonPositiveFloat';
import PositiveFloat from './PositiveFloat';
import NonNegativeFloatFactory from './NonNegativeFloat';
import NegativeFloat from './NegativeFloat';
import EmailAddress from './EmailAddress';
import URL from './URL';
import PhoneNumber from './PhoneNumber';
import PostalCode from './PostalCode';
import BigIntFactory from './BigInt';
import Byte from './Byte';
import GUID from './GUID';
import Hexadecimal from './Hexadecimal';
import HexColorCode from './HexColorCode';
import HSL from './HSL';
import HSLA from './HSLA';
import IPv4 from './IPv4';
import IPv6 from './IPv6';
import ISBN from './ISBN';
import MAC from './MAC';
import Port from './Port';
import RGB from './RGB';
import RGBA from './RGBA';
import USCurrency from './USCurrency';
import Currency from './Currency';
import { JSON, JSONObject } from './JSON';
import IBAN from './IBAN';
import ObjectID from './ObjectID';
import Void from './Void';

const BigIntResolver = BigIntFactory('BigInt');
const LongResolver = BigIntFactory('Long');

const NonNegativeIntResolver = NonNegativeIntFactory('NonNegativeInt');
const UnsignedIntResolver = NonNegativeIntFactory('UnsignedInt');

const NonNegativeFloatResolver = NonNegativeFloatFactory('NonNegativeFloat');
const UnsignedFloatResolver = NonNegativeFloatFactory('UnsignedFloat');

export {
  Date,
  Time,
  DateTime,
  Timestamp,
  UtcOffset,
  NonPositiveInt,
  PositiveInt,
  NonNegativeIntResolver as NonNegativeInt,
  UnsignedIntResolver as UnsignedInt,
  NegativeInt,
  NonPositiveFloat,
  PositiveFloat,
  NonNegativeFloatResolver as NonNegativeFloat,
  UnsignedFloatResolver as UnsignedFloat,
  NegativeFloat,
  EmailAddress,
  URL,
  PhoneNumber,
  PostalCode,
  BigIntResolver as BigInt,
  LongResolver as Long,
  Byte,
  GUID,
  Hexadecimal,
  HexColorCode,
  HSL,
  HSLA,
  IPv4,
  IPv6,
  ISBN,
  MAC,
  Port,
  RGB,
  RGBA,
  USCurrency,
  Currency,
  JSON,
  JSONObject,
  IBAN,
  ObjectID,
  Void,
};
