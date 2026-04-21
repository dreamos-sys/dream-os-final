#include <stdint.h>
#define WASM_EXPORT __attribute__((visibility("default")))
#define SALT 0xFACE
#define HASH_DEVELOPER 1533935091
static int32_t icon_click_counter = 0;
uint32_t internal_hash(const char* str) {
    uint32_t h = 0;
    for (int i = 0; str[i] != '\0'; i++) h ^= ((uint32_t)str[i] << ((i % 4) * 8));
    return h ^ SALT;
}
WASM_EXPORT int32_t trigger_icon_click() {
    if (++icon_click_counter >= 7) { icon_click_counter = 0; return 7; }
    return icon_click_counter;
}
WASM_EXPORT int32_t validate_ghost_stealth(int32_t hh, int32_t mm, int32_t rakaat) {
    int32_t target = ((hh * 60 + mm) >= 1080 && (hh * 60 + mm) < 1170) ? 3 : 4;
    return (rakaat == target);
}
WASM_EXPORT int32_t get_access_level(const char* pass) {
    if (internal_hash(pass) == HASH_DEVELOPER) return 0;
    return 99;
}
